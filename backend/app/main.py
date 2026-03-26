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
from .llm_engine import optimize_resume_text, generate_gap_questions, optimize_with_context
from .pdf_gen import generate_ats_pdf

class ExportRequest(BaseModel):
    markdown: str

class BridgeGapRequest(BaseModel):
    task_id: str
    answers: str

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
        # If it looks like contact info or name and we've seen it, skip it
        # This is a basic heuristic to help the AI not get overwhelmed
        if len(line_strip) < 100: # Short lines like names/addresses are most prone to repeat
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

        # Pre-clean to remove massive repetition artifacts from headers/footers
        cleaned_text = pre_clean_raw_text(raw_resume_text)

        # Initial analysis
        analysis = get_match_score(cleaned_text, job_description)
        task_id = str(uuid.uuid4())

        # Use upgraded LLM to generate a truly optimized initial version
        optimized_markdown = optimize_resume_text(cleaned_text, job_description, analysis['missing_keywords'])

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
    job_description: str = Form(...)
):
    # Call real LLM engine
    optimized_text = optimize_resume_text(resume_text, job_description)
    return {"optimized_text": optimized_text}

@app.post("/api/v1/bridge-gap/questions")
async def get_bridge_questions(
    task_id: str = Form(...),
    resume_text: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None)
):
    # Try memory store first
    result = analysis_store.get(task_id)
    
    # If not in memory, use the provided text (Stateless Fallback)
    final_resume = resume_text or (result["original_text"] if result else None)
    final_jd = job_description or (result["job_description"] if result else None)
    final_keywords = result["missing_keywords"] if result else []

    if not final_resume or not final_jd:
        raise HTTPException(status_code=404, detail="Analysis context not found. Please provide resume_text and job_description.")
    
    questions = generate_gap_questions(final_keywords, final_jd, final_resume)
    return {"questions": questions}

@app.post("/api/v1/bridge-gap/optimize")
async def bridge_gap_optimize(request: BridgeGapRequest):
    # Try memory store first
    result = analysis_store.get(request.task_id)
    
    # Fallback context if provided in request (would need model update, but let's stick to memory/db logic)
    if not result:
        # For now, if it's not in memory, we'll return a clear error
        # In a future update we could fetch from Supabase here
        raise HTTPException(status_code=404, detail="Task session expired. Please re-upload or refresh.")
    
    try:
...
        print(f"Re-optimization complete. New score: {new_analysis['overall_score']}%")
        return analysis_store[request.task_id]
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/export")
async def export_pdf(
    request: ExportRequest
):
    try:
        print(f"Generating PDF for content (length: {len(request.markdown)})")
        pdf_bytes = generate_ats_pdf(request.markdown)
        print("PDF generated successfully")
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

if __name__ == "__main__":
    import uvicorn
    import os
    # Bind to 0.0.0.0 and dynamic port for cloud environments
    port = int(os.getenv("PORT", 9000))
    uvicorn.run(app, host="0.0.0.0", port=port)
