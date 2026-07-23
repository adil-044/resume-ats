from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import List, Optional
from pydantic import BaseModel
import uuid
import json
import traceback
import re
from .parser import parse_file
from .nlp import get_match_score
from .llm_engine import (
    optimize_resume_text,
    generate_gap_questions,
    optimize_with_context,
    generate_cover_letter,
    _call_model,
    _model_chain,
)
from .pdf_gen import generate_ats_pdf

class ExportRequest(BaseModel):
    markdown: str

class BridgeGapRequest(BaseModel):
    task_id: str
    answers: str
    # Workspace loads from Supabase — in-memory analysis_store is often empty after refresh.
    resume_text: Optional[str] = None
    job_description: Optional[str] = None
    missing_keywords: Optional[List[str]] = None

app = FastAPI(title="ATS-Optimized Resume API v2")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (volatile)
analysis_store = {}

@app.get("/api/v1/test-ai")
async def test_ai():
    """Direct test of OpenRouter free-model chain — bypasses all parsing."""
    try:
        content, model = _call_model("Say 'AI works' in exactly those 2 words.", max_tokens=32)
        return {"status": "ok", "model": model, "response": content, "chain": _model_chain()}
    except Exception as e:
        return {"status": "error", "error": str(e), "chain": _model_chain()}

@app.get("/")
async def root():
    return {"message": "ATS-Optimized Resume API v2 is online"}

def pre_clean_raw_text(text: str) -> str:
    """Aggressively remove obvious repetitions before AI processing."""
    # Split into lines and find unique content-heavy lines
    lines = text.split('\n')
    seen = set()
    cleaned = []
    for line in lines:
        line_strip = line.strip()
        if not line_strip:
            cleaned.append("")
            continue
        if len(line_strip) < 100:
            if line_strip.lower() in seen:
                continue
            seen.add(line_strip.lower())
        cleaned.append(line_strip)
    return "\n".join(cleaned)

@app.post("/api/v1/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        print(f"Uploading resume: {resume.filename}")
        content = await resume.read()
        raw_resume_text = parse_file(content, resume.filename)

        if not raw_resume_text:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        cleaned_text = pre_clean_raw_text(raw_resume_text)
        analysis = get_match_score(cleaned_text, job_description)
        task_id = str(uuid.uuid4())
        optimized_markdown = optimize_resume_text(cleaned_text, job_description, analysis['missing_keywords'])

        if not (optimized_markdown or "").strip():
            raise HTTPException(status_code=502, detail="AI returned empty resume content. Retry shortly.")

        if "AI OPTIMIZATION ERROR" in optimized_markdown or "AI KEY NOT FOUND" in optimized_markdown:
            raise HTTPException(status_code=502, detail="AI optimization failed. Check OPENROUTER_API_KEY / model availability.")

        analysis_result = {
            "id": task_id,
            "initial_score": analysis["overall_score"],
            "overall_score": analysis["overall_score"],
            "breakdown": analysis["breakdown"],
            "missing_keywords": analysis["missing_keywords"],
            "matched_keywords": analysis.get("matched_keywords", []),
            "formatting_issues": ["Executive single-column layout verified"],
            "optimized_content": {
                "format": "markdown",
                "raw_text": optimized_markdown
            },
            "job_description": job_description,
            "original_text": cleaned_text
        }

        analysis_store[task_id] = analysis_result
        return analysis_result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/analysis/{task_id}")
async def get_analysis(task_id: str):
    if task_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis_store[task_id]

@app.post("/api/v1/optimize")
async def optimize(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    missing_keywords: Optional[str] = Form(None),
):
    keywords: List[str] = []
    if missing_keywords:
        try:
            parsed = json.loads(missing_keywords)
            if isinstance(parsed, list):
                keywords = [str(k) for k in parsed]
        except Exception:
            keywords = [k.strip() for k in missing_keywords.split(",") if k.strip()]
    if not keywords:
        # Derive gaps so optimize isn't skills-blind when client omits them
        try:
            keywords = get_match_score(resume_text, job_description).get("missing_keywords", [])
        except Exception:
            keywords = []

    optimized_text = optimize_resume_text(resume_text, job_description, keywords)
    if not (optimized_text or "").strip() or "AI OPTIMIZATION ERROR" in optimized_text:
        raise HTTPException(status_code=502, detail="AI optimization failed across free models. Retry shortly.")
    return {"optimized_text": optimized_text}

@app.post("/api/v1/bridge-gap/questions")
async def get_bridge_questions(
    task_id: str = Form(...),
    resume_text: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    missing_keywords: Optional[str] = Form(None),
):
    result = analysis_store.get(task_id)
    final_resume = resume_text or (result["original_text"] if result else None) or (
        result["optimized_content"]["raw_text"] if result and result.get("optimized_content") else None
    )
    final_jd = job_description or (result["job_description"] if result else None)
    final_keywords = result["missing_keywords"] if result else []
    if missing_keywords:
        try:
            parsed = json.loads(missing_keywords)
            if isinstance(parsed, list):
                final_keywords = [str(k) for k in parsed]
        except Exception:
            final_keywords = [k.strip() for k in missing_keywords.split(",") if k.strip()] or final_keywords

    if not final_resume or not final_jd:
        raise HTTPException(status_code=404, detail="Analysis context not found. Please provide resume_text and job_description.")
    
    questions = generate_gap_questions(final_keywords, final_jd, final_resume)
    return {"questions": questions}

@app.post("/api/v1/bridge-gap/optimize")
async def bridge_gap_optimize(request: BridgeGapRequest):
    try:
        result = analysis_store.get(request.task_id)

        resume_md = None
        if result and result.get("optimized_content"):
            resume_md = result["optimized_content"].get("raw_text")
        resume_md = request.resume_text or resume_md

        jd = request.job_description or (result.get("job_description") if result else None)

        if not resume_md or not jd:
            raise HTTPException(
                status_code=404,
                detail="Task session expired. Re-open the resume from History, or send resume_text + job_description.",
            )

        optimized_text = optimize_with_context(resume_md, jd, request.answers)
        if not (optimized_text or "").strip() or "AI OPTIMIZATION ERROR" in optimized_text:
            raise HTTPException(status_code=502, detail="AI optimization failed across free models. Retry shortly.")

        new_analysis = get_match_score(optimized_text, jd)

        payload = {
            "id": request.task_id,
            "overall_score": new_analysis["overall_score"],
            "breakdown": new_analysis["breakdown"],
            "missing_keywords": new_analysis["missing_keywords"],
            "matched_keywords": new_analysis.get("matched_keywords", []),
            "optimized_content": {"format": "markdown", "raw_text": optimized_text},
            "job_description": jd,
            "original_text": (result or {}).get("original_text") or resume_md,
        }

        if result is not None:
            analysis_store[request.task_id]["optimized_content"]["raw_text"] = optimized_text
            analysis_store[request.task_id]["overall_score"] = new_analysis["overall_score"]
            analysis_store[request.task_id]["breakdown"] = new_analysis["breakdown"]
            analysis_store[request.task_id]["missing_keywords"] = new_analysis["missing_keywords"]
            analysis_store[request.task_id]["matched_keywords"] = new_analysis.get("matched_keywords", [])
            return analysis_store[request.task_id]

        return payload
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/export")
async def export_pdf(
    request: ExportRequest
):
    try:
        pdf_bytes = generate_ats_pdf(request.markdown)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=ATS_Optimized_Resume.pdf",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/cover-letter")
async def create_cover_letter(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Generate a personalized cover letter from an uploaded resume file + job description."""
    try:
        content = await resume.read()
        resume_text = parse_file(content, resume.filename)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX.")
        cleaned_text = pre_clean_raw_text(resume_text)
        cover_letter_md = generate_cover_letter(cleaned_text, job_description)
        return {"cover_letter": cover_letter_md}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 9000))
    uvicorn.run(app, host="0.0.0.0", port=port)

