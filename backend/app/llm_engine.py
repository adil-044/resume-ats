import os
import json
from openai import OpenAI
from typing import List, Optional, Tuple

# OpenRouter configuration
OPENROUTER_BASE = "https://openrouter.ai/api/v1"

# tencent/hy3:free often disappears from the free catalog — keep a live fallback chain.
DEFAULT_FREE_MODELS = [
    "nvidia/nemotron-nano-9b-v2:free",
    "openai/gpt-oss-20b:free",
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "poolside/laguna-xs-2.1:free",
]


def _model_chain() -> List[str]:
    """Ordered free-model fallback list. Override via env."""
    primary = (os.getenv("OPENROUTER_MODEL") or "").strip()
    extra = (os.getenv("OPENROUTER_FREE_MODELS") or "").strip()
    models: List[str] = []
    if primary:
        models.append(primary)
    if extra:
        models.extend(m.strip() for m in extra.split(",") if m.strip())
    models.extend(DEFAULT_FREE_MODELS)
    seen = set()
    out: List[str] = []
    for m in models:
        if m not in seen:
            seen.add(m)
            out.append(m)
    return out


def _get_client() -> OpenAI:
    """Lazily initialize OpenRouter client — reads key at call time, not import time."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set")
    return OpenAI(
        api_key=api_key,
        base_url=OPENROUTER_BASE,
        default_headers={
            "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "https://hire-ready.app"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "HireReady"),
        },
    )


def _call_model(prompt: str, *, max_tokens: Optional[int] = None) -> Tuple[str, str]:
    """Try free OpenRouter models in order until one returns content."""
    print(f"--- AI STATUS: _call_model called, prompt length = {len(prompt)} chars ---")
    client = _get_client()
    errors: List[str] = []

    for model in _model_chain():
        try:
            print(f"--- AI STATUS: trying model {model} ---")
            kwargs = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            }
            if max_tokens is not None:
                kwargs["max_tokens"] = max_tokens
            response = client.chat.completions.create(**kwargs)
            content = (response.choices[0].message.content or "").strip()
            if not content:
                errors.append(f"{model}: empty content")
                print(f"--- AI STATUS: {model} returned empty ---")
                continue
            print(f"--- AI STATUS: {model} ok, {len(content)} chars ---")
            return content, model
        except Exception as e:
            msg = str(e)
            errors.append(f"{model}: {msg}")
            print(f"--- AI ERROR: {model} failed: {msg} ---")
            continue

    raise RuntimeError("All OpenRouter free models failed: " + " | ".join(errors))


def optimize_resume_text(resume_markdown: str, job_description: str, missing_keywords: List[str] = []) -> str:
    """Rewrite the resume for ATS compatibility via OpenRouter free models."""
    print(f"--- AI STATUS: optimize_resume_text called ---")
    print(f"Resume length: {len(resume_markdown)} chars, JD length: {len(job_description)} chars")

    prompt = f"""
ROLE: Elite Executive Resume Architect & ATS Logic Expert.
TASK: Transform the 'NOISY RAW TEXT' into a world-class, deduplicated, ATS-optimized Executive Resume in clean Markdown.

---
CRITICAL RULES (FORBIDDEN ACTIONS):
1. DO NOT invent employers, job titles, dates, degrees, certifications, metrics, or skills that are not supported by the raw resume or the user's stated details.
2. DO NOT repeat the Name, Email, or Address after the initial header.
3. DO NOT dump keywords in a random list at the end. Every keyword MUST be woven into a specific bullet point or a categorized skill section.
4. Output MUST be English only — no other scripts, languages, or random characters.
5. If a missing keyword cannot be honestly supported by the resume, put it only under a skills section labeled clearly — do not fabricate experience bullets for it.

---
CLEANING PROTOCOL:
1. EXTRACT: Find the Name and Contact info ONCE. Place it at the very top.
2. CATEGORIZE: Group these keywords into the TECHNICAL SKILLS section when relevant: {', '.join(missing_keywords)}
3. INJECT: Rewrite Experience bullets to naturally include relevant keywords from the JD only when truthful. Bold them: **Keyword**.

---
REQUIRED STRUCTURE (Markdown):
# [FULL NAME]
[Email | Phone | LinkedIn | Location]

---

## EXECUTIVE SUMMARY
[A 3-4 sentence professional narrative. Integrate 2-3 core keywords here. No first-person pronouns.]

---

## TECHNICAL SKILLS & COMPETENCIES
[Categorized list grounded in the resume + JD keywords.]

---

## PROFESSIONAL EXPERIENCE
[Company Name | Job Title | Dates]
- [High-impact bullet using Action + Context + Result. Only use metrics present in the source.]

---

## EDUCATION & CERTIFICATIONS
[Clean list from the source only.]

---

JOB DESCRIPTION:
{job_description}

RAW DATA TO PROCESS:
{resume_markdown}

OUTPUT FINAL EXECUTIVE MARKDOWN ONLY:
"""

    try:
        text, used = _call_model(prompt)
        print(f"--- AI STATUS: optimize used {used} ---")
        text = text.replace('```markdown', '').replace('```', '').strip()
        return text
    except Exception as e:
        error_msg = f"--- AI ERROR: {str(e)} ---"
        print(error_msg)
        return f"# AI OPTIMIZATION ERROR\n\n{error_msg}\n\nPlease check your backend terminal for details."


def generate_gap_questions(missing_keywords: List[str], job_description: str, resume_content: str = "") -> List[str]:
    """Perform a deep delta analysis to generate high-signal questions."""
    prompt = f"""
ROLE: Expert Technical Recruiter & ATS Analyst.
TASK: Analyze the 'GAP' between the Candidate's Resume and the Job Description.

CANDIDATE DATA: {resume_content[:2000]}
JOB REQUIREMENTS: {job_description[:2000]}
IDENTIFIED MISSING KEYWORDS: {', '.join(missing_keywords[:15])}

INSTRUCTIONS:
1. Identify the 5 most critical missing technical or leadership skills that are in the JD but NOT in the resume.
2. Generate EXACTLY 5 targeted, distinct interview questions (one per skill).
3. Each question MUST ask for SPECIFIC evidence, metrics, or tools used.
4. Format the output as a clean JSON list of 5 strings. No preamble.

OUTPUT FORMAT: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
"""

    try:
        text, used = _call_model(prompt, max_tokens=1200)
        print(f"--- AI STATUS: gap questions used {used} ---")
        text = text.replace('```json', '').replace('```', '').strip()
        if '[' in text and ']' in text:
            text = text[text.find('['):text.rfind(']')+1]
        parsed = json.loads(text)
        if isinstance(parsed, list) and parsed:
            return [str(q) for q in parsed][:5]
        raise ValueError("Gap questions JSON was not a non-empty list")
    except Exception as e:
        print(f"Deep Gap Gen Error: {e}")
        if missing_keywords:
            return [f"How have you applied {kw} in your professional career?" for kw in missing_keywords[:5]]
        return [
            "Which tools or systems from this job posting have you used hands-on?",
            "Describe a metric-driven result that maps to this role's top priority.",
            "What leadership or collaboration experience matches this team's needs?",
            "Which required skill are you strongest in, and what is the evidence?",
            "What gap in your resume should we clarify with a concrete example?",
        ]


def optimize_with_context(resume_markdown: str, job_description: str, user_answers: str) -> str:
    """Aggressive 90%+ optimization pass integrating user answers."""
    prompt = f"""
ROLE: Expert Resume Architect.
GOAL: Achieve a 95%+ ATS match score.

CRITICAL: Extract Name/Contact info ONCE at the top. Remove any duplicates found in the body.

CONTEXT:
1. CURRENT RESUME: {resume_markdown}
2. TARGET JOB: {job_description}
3. NEW USER DETAILS: {user_answers}

TASK:
- Rewrite the resume to INTEGRATE every detail from the New User Details when truthful.
- Do NOT invent employers, titles, dates, or metrics.
- English only. No other scripts or languages.
- Ensure keywords from the user answers are **bolded**.
- RESTRUCTURE into a clean Executive Markdown format with --- dividers.
- Maintain single-column, professional objective language.

OUTPUT: ONLY the optimized Markdown.
"""

    try:
        text, used = _call_model(prompt)
        print(f"--- AI STATUS: bridge optimize used {used} ---")
        text = text.replace('```markdown', '').replace('```', '').strip()
        return text
    except Exception as e:
        print(f"Final Optimization Error: {e}")
        return resume_markdown


def generate_cover_letter(resume_text: str, job_description: str) -> str:
    """Generate a tailored cover letter via OpenRouter free models."""
    prompt = f"""
ROLE: Professional Career Writer & Cover Letter Specialist.
TASK: Write a compelling, personalized cover letter for the candidate below.

---
RULES:
1. The letter MUST be tailored to the specific job description provided.
2. Reference 2-3 SPECIFIC achievements or experiences from the candidate's resume that directly relate to the job requirements.
3. Use a professional but warm tone. Avoid generic phrases like "I am writing to express my interest".
4. Keep it concise: 3-4 paragraphs maximum (Opening, Body 1-2, Closing).
5. Do NOT fabricate any experience — only reference what is in the resume.
6. Include placeholders for [Company Name] and [Hiring Manager Name] if not known.
7. Output clean Markdown format.
8. Do NOT include the candidate's address or date header — just the letter body.

---
STRUCTURE:
# Cover Letter

Dear [Hiring Manager Name],

[Opening paragraph: Hook + why this role + why this company]

[Body paragraph 1: Most relevant achievement from resume, connected to a key job requirement. Use specific metrics/results.]

[Body paragraph 2: Second relevant skill/experience. Show how it maps to another job requirement.]

[Closing paragraph: Enthusiasm + call to action + thank you]

Sincerely,
[Candidate Name]

---
CANDIDATE'S RESUME:
{resume_text[:3000]}

TARGET JOB DESCRIPTION:
{job_description[:2000]}

OUTPUT THE COVER LETTER IN MARKDOWN:
"""

    try:
        text, used = _call_model(prompt)
        print(f"--- AI STATUS: cover letter used {used} ---")
        text = text.replace('```markdown', '').replace('```', '').strip()
        return text
    except Exception as e:
        print(f"Cover Letter Generation Error: {e}")
        return f"# Cover Letter Generation Error\n\n{str(e)}\n\nPlease try again."
