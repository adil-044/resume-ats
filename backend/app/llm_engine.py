import os
import json
from openai import OpenAI
from typing import List

# OpenRouter configuration
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
MODEL_ID = "tencent/hy3:free"


def _get_client() -> OpenAI:
    """Lazily initialize OpenRouter client — reads key at call time, not import time."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set")
    return OpenAI(api_key=api_key, base_url=OPENROUTER_BASE)


def _call_model(prompt: str) -> str:
    """Make an OpenRouter API call, handling errors consistently."""
    print(f"--- AI STATUS: _call_model called, prompt length = {len(prompt)} chars ---")
    try:
        client = _get_client()
        print(f"--- AI STATUS: OpenRouter client initialized, calling API... ---")
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}]
        )
        print(f"--- AI STATUS: API response received, {len(response.choices[0].message.content)} chars ---")
        return response.choices[0].message.content
    except Exception as e:
        print(f"--- AI ERROR: _call_model exception: {str(e)} ---")
        raise RuntimeError(f"OpenRouter API error: {str(e)}")


def optimize_resume_text(resume_markdown: str, job_description: str, missing_keywords: List[str] = []) -> str:
    """Use Tencent Hy3 via OpenRouter to rewrite the resume for maximum ATS compatibility."""
    print(f"--- AI STATUS: optimize_resume_text called ---")
    print(f"Resume length: {len(resume_markdown)} chars, JD length: {len(job_description)} chars")
    
    prompt = f"""
ROLE: Elite Executive Resume Architect & ATS Logic Expert.
TASK: Transform the 'NOISY RAW TEXT' into a world-class, deduplicated, 95%+ ATS-optimized Executive Resume.

---
CRITICAL RULES (FORBIDDEN ACTIONS):
1. DO NOT repeat the Name, Email, or Address after the initial header.
2. DO NOT dump keywords in a random list at the end. Every keyword MUST be woven into a specific bullet point or a categorized skill section.
3. DO NOT include meta-text like 'PROFESSIONAL SUMMARY' or 'EXPERIENCE' inside the actual section content.

---
CLEANING PROTOCOL:
1. EXTRACT: Find the Name and Contact info ONCE. Place it at the very top.
2. CATEGORIZE: Group these keywords into the TECHNICAL SKILLS section: {', '.join(missing_keywords)}
3. INJECT: Rewrite Experience bullets to naturally include relevant keywords from the JD. Bold them: **Keyword**.

---
REQUIRED STRUCTURE (Markdown):
# [FULL NAME]
[Email | Phone | LinkedIn | Location]

---

## EXECUTIVE SUMMARY
[A 3-4 sentence professional narrative. Integrate 2-3 core keywords here. No first-person pronouns.]

---

## TECHNICAL SKILLS & COMPETENCIES
[Categorized list: e.g., Culinary Operations, Management & Leadership, Compliance, etc. Categorize every keyword provided above here.]

---

## PROFESSIONAL EXPERIENCE
[Company Name | Job Title | Dates]
- [High-impact bullet using Action + Context + Result formula. Weave in keywords naturally.]

---

## EDUCATION & CERTIFICATIONS
[Clean list of degrees and certifications.]

---

JOB DESCRIPTION:
{job_description}

RAW DATA TO PROCESS:
{resume_markdown}

OUTPUT FINAL EXECUTIVE MARKDOWN:
"""

    try:
        text = _call_model(prompt)
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
        text = _call_model(prompt)
        text = text.replace('```json', '').replace('```', '').strip()
        if '[' in text and ']' in text:
            text = text[text.find('['):text.rfind(']')+1]
        return json.loads(text)
    except Exception as e:
        print(f"Deep Gap Gen Error: {e}")
        return [f"How have you applied {kw} in your professional career?" for kw in missing_keywords[:5]]


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
- Rewrite the resume to INTEGRATE every detail from the New User Details.
- Ensure keywords from the user answers are **bolded**.
- RESTRUCTURE into a clean Executive Markdown format with --- dividers.
- Maintain single-column, professional objective language.

OUTPUT: ONLY the optimized Markdown.
"""

    try:
        text = _call_model(prompt)
        text = text.replace('```markdown', '').replace('```', '').strip()
        return text
    except Exception as e:
        print(f"Final Optimization Error: {e}")
        return resume_markdown


def generate_cover_letter(resume_text: str, job_description: str) -> str:
    """Use Tencent Hy3 via OpenRouter to generate a tailored, professional cover letter."""
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
        text = _call_model(prompt)
        text = text.replace('```markdown', '').replace('```', '').strip()
        return text
    except Exception as e:
        print(f"Cover Letter Generation Error: {e}")
        return f"# Cover Letter Generation Error\n\n{str(e)}\n\nPlease try again."
