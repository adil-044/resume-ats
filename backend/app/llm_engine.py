import os
import json
import re
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

# Ban generic resume-generator slop
_SLOP_PHRASES = [
    "results-driven",
    "detail-oriented",
    "self-starter",
    "team player",
    "proven track record",
    "passionate about",
    "highly motivated",
    "dynamic professional",
    "seasoned professional",
    "leveraged synergies",
    "go-getter",
    "hard worker",
    "think outside the box",
    "best of breed",
    "synergistic",
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
                "temperature": 0.25,
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


def _clean_markdown(text: str) -> str:
    text = text.replace("```markdown", "").replace("```", "").strip()
    # Strip common model preambles
    text = re.sub(
        r"^(here(?:'s| is) (?:the )?(?:optimized |rewritten )?resume[:\s]*)",
        "",
        text,
        flags=re.I,
    ).strip()
    return text


def _rewrite_contract(missing_keywords: List[str]) -> str:
    kw = ", ".join(missing_keywords[:20]) if missing_keywords else "(derive from JD)"
    return f"""
YOU ARE NOT A GENERIC RESUME GENERATOR.
You are a human resume editor rewriting ONE real candidate against ONE job posting.

PRIMARY JOB (do this first — not optional):
Rewrite EVERY Professional Experience bullet so duties align to the job description.
Do NOT leave original duty wording intact. Do NOT only edit the Skills section.
Skills are secondary. Experience bullets carry the ATS match.

XYZ BULLET FORMULA (required for every experience bullet):
Accomplished [X] as measured by [Y], by doing [Z].
- X = outcome / ownership tied to a JD requirement
- Y = metric or scope ONLY if present in the source resume (%, $, #, volume, seats, team size, hours, SKUs, covers, tickets). If no number exists, use concrete scope from the source (e.g. "nightly service", "multi-station line") — NEVER invent fake percentages or dollar amounts.
- Z = method / tools / process that mirrors JD language when truthful

JD ALIGNMENT RULES:
1. Pull the posting's required duties, tools, and outcomes. Map each existing role's real work onto those themes.
2. Prefer the posting's verbs and nouns inside bullets when the candidate's work supports them (e.g. if they managed stock and JD says inventory, write inventory).
3. Bold **JD keywords** inside bullets and summary when woven naturally — not as a dump list.
4. Keep the same employers, titles, and dates as the source. Never invent jobs, companies, degrees, or certifications.
5. Keep roughly the same number of roles. Expand thin bullets into 3–5 strong XYZ bullets per recent role when source content supports it; merge fluff.

ANTI-SLOP (forbidden):
- Skills-only "optimization" while Experience stays copy-pasted
- Keyword stuffing footer / random skill clouds
- Phrases: {", ".join(_SLOP_PHRASES)}
- Fake metrics, fake employers, fake certifications
- First-person ("I", "my")
- Non-English characters or random scripts
- "Executive Summary" that could fit any candidate

SUMMARY:
3–4 lines, role-specific, grounded in THIS resume + THIS JD. No fluff adjectives.

SKILLS:
Short categorized list AFTER experience logic is done. Only skills evidenced in resume or honestly implied by stated work. Include relevant gaps only as soft skills the candidate already demonstrated nearby — never claim tools they never used.

MISSING / TARGET KEYWORDS TO WEAVE WHEN TRUE: {kw}
"""


def optimize_resume_text(resume_markdown: str, job_description: str, missing_keywords: List[str] = []) -> str:
    """Full JD-aligned resume rewrite (XYZ bullets) via OpenRouter free models."""
    print("--- AI STATUS: optimize_resume_text called ---")
    print(f"Resume length: {len(resume_markdown)} chars, JD length: {len(job_description)} chars")

    prompt = f"""
{_rewrite_contract(missing_keywords)}

OUTPUT FORMAT (Markdown only — no preamble):
# [FULL NAME]
[Email | Phone | LinkedIn | Location]

---

## PROFESSIONAL SUMMARY
[3–4 lines tailored to this JD]

---

## PROFESSIONAL EXPERIENCE
### [Job Title] | [Company] | [Dates]
- [XYZ bullet aligned to JD]
- [XYZ bullet aligned to JD]
- [XYZ bullet aligned to JD]

### [Next role...]
- ...

---

## SKILLS
[Short categorized list — last, not the main change]

---

## EDUCATION & CERTIFICATIONS
[From source only]

---

TARGET JOB DESCRIPTION:
{job_description[:6000]}

SOURCE RESUME (rewrite duties; keep identity facts):
{resume_markdown[:12000]}

Write the FULL rewritten resume now. Experience section must be substantially rewritten — not a skills tweak.
"""

    try:
        text, used = _call_model(prompt, max_tokens=4500)
        print(f"--- AI STATUS: optimize used {used} ---")
        return _clean_markdown(text)
    except Exception as e:
        error_msg = f"--- AI ERROR: {str(e)} ---"
        print(error_msg)
        return f"# AI OPTIMIZATION ERROR\n\n{error_msg}\n\nPlease check your backend terminal for details."


def generate_gap_questions(missing_keywords: List[str], job_description: str, resume_content: str = "") -> List[str]:
    """Ask for real metrics / evidence the rewrite can use in XYZ bullets."""
    prompt = f"""
ROLE: Technical recruiter closing gaps between a resume and a job posting.
TASK: Ask for SPECIFIC evidence so a resume can be rewritten with XYZ bullets (Accomplished X as measured by Y by doing Z).

CANDIDATE RESUME (excerpt):
{resume_content[:2500]}

JOB DESCRIPTION (excerpt):
{job_description[:2500]}

MISSING KEYWORDS: {', '.join(missing_keywords[:15])}

RULES:
1. Exactly 5 distinct questions.
2. Each question must demand a metric, tool, volume, or concrete example — not vague soft skills.
3. Prefer gaps that would improve Experience bullets, not just a skills list.
4. JSON array of 5 strings only. No preamble.

OUTPUT: ["Q1", "Q2", "Q3", "Q4", "Q5"]
"""

    try:
        text, used = _call_model(prompt, max_tokens=1200)
        print(f"--- AI STATUS: gap questions used {used} ---")
        text = text.replace("```json", "").replace("```", "").strip()
        if "[" in text and "]" in text:
            text = text[text.find("[") : text.rfind("]") + 1]
        parsed = json.loads(text)
        if isinstance(parsed, list) and parsed:
            return [str(q) for q in parsed][:5]
        raise ValueError("Gap questions JSON was not a non-empty list")
    except Exception as e:
        print(f"Deep Gap Gen Error: {e}")
        if missing_keywords:
            return [
                f"For {kw}: what measurable result did you own (%, $, #, volume), and what did you do to get it?"
                for kw in missing_keywords[:5]
            ]
        return [
            "Which JD tool/system have you used hands-on, and on what scale (users, tickets, covers, SKUs)?",
            "Pick the strongest metric from your last role — what changed because of your work?",
            "Describe one duty from the posting that matches work you already did — include numbers if you have them.",
            "Where did you lead people or process? Team size and outcome?",
            "What gap in your resume should we clarify with a concrete before/after example?",
        ]


def optimize_with_context(resume_markdown: str, job_description: str, user_answers: str) -> str:
    """Second-pass rewrite: fold gap answers into XYZ experience bullets."""
    prompt = f"""
{_rewrite_contract([])}

SECOND PASS — use NEW USER DETAILS as primary evidence for metrics and missing JD themes.
Rewrite the WHOLE resume again (especially Experience). Do not only patch Skills.

Integrate user answers into XYZ bullets. Bold new keywords when natural.
Do NOT invent employers, titles, dates, or metrics beyond what the resume + answers support.
English only.

OUTPUT: ONLY the full rewritten Markdown resume (same structure as a complete resume).

CURRENT RESUME:
{resume_markdown[:10000]}

TARGET JOB:
{job_description[:5000]}

NEW USER DETAILS (metrics / evidence to weave into duties):
{user_answers[:4000]}
"""

    try:
        text, used = _call_model(prompt, max_tokens=4500)
        print(f"--- AI STATUS: bridge optimize used {used} ---")
        return _clean_markdown(text)
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
2. Reference 2-3 SPECIFIC achievements from the resume that map to JD duties — use real metrics if present.
3. Professional, concrete tone. Ban: "I am writing to express my interest", "passionate", "results-driven".
4. 3–4 paragraphs max (Opening, Body 1–2, Closing).
5. Do NOT fabricate experience.
6. Placeholders OK for [Company Name] and [Hiring Manager Name].
7. Clean Markdown. No address/date header.

---
STRUCTURE:
# Cover Letter

Dear [Hiring Manager Name],

[Opening: why this role + one concrete proof point]

[Body 1: XYZ-style achievement mapped to a JD requirement]

[Body 2: Second mapped achievement / skill]

[Closing: clear ask]

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
        text, used = _call_model(prompt, max_tokens=2000)
        print(f"--- AI STATUS: cover letter used {used} ---")
        return _clean_markdown(text)
    except Exception as e:
        print(f"Cover Letter Generation Error: {e}")
        return f"# Cover Letter Generation Error\n\n{str(e)}\n\nPlease try again."
