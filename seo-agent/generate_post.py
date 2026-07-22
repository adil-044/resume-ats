#!/usr/bin/env python3
"""HireReady SEO daily post agent — ATS/resume genre (mirror of SousXChef SEO GEO system)."""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "frontend" / "content" / "blog"
QUEUE_PATH = AGENT / "queue.json"
PUBLISHED_PATH = AGENT / "published.json"
KEYWORDS_PATH = AGENT / "keywords.json"

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
FREE_MODELS = [
    "openai/gpt-oss-20b:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "openrouter/free",
    "google/gemma-4-31b-it:free",
]
DEFAULT_MODEL = "openai/gpt-oss-20b:free"


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:80] or "post"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def next_topic(queue: dict, published: dict) -> dict | None:
    used = {p.get("keyword", "").lower() for p in published.get("published", [])}
    remaining = []
    for item in queue.get("queue", []):
        if item.get("keyword", "").lower() in used:
            continue
        remaining.append(item)
    queue["queue"] = remaining
    if not remaining:
        return None
    return remaining[0]


def free_model_chain(cfg: dict) -> list[str]:
    models = list(cfg.get("free_models") or FREE_MODELS)
    primary = cfg.get("model") or DEFAULT_MODEL
    if primary not in models:
        models.insert(0, primary)
    # de-dupe preserve order
    seen: set[str] = set()
    out: list[str] = []
    for m in models:
        if m not in seen:
            seen.add(m)
            out.append(m)
    return out


def call_openrouter(prompt: str, models: list[str]) -> tuple[str, str]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError("Install openai: pip install openai") from e

    client = OpenAI(api_key=api_key, base_url=OPENROUTER_BASE)
    errors: list[str] = []
    for model in models:
        try:
            print(f"Trying free model: {model}")
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            content = (response.choices[0].message.content or "").strip()
            if not content:
                errors.append(f"{model}: empty content")
                continue
            return content, model
        except Exception as e:
            errors.append(f"{model}: {e}")
            print(f"Model failed: {model} — {e}")
    raise RuntimeError("All free models failed: " + " | ".join(errors))


def build_prompt(topic: dict, cfg: dict, today: str) -> str:
    keyword = topic["keyword"]
    angle = topic.get("angle", "")
    return f"""You write SEO blog posts for HireReady (https://hire-ready.app), an ATS resume analyzer.

GENRE: job seekers, ATS filters, resume keywords, Workday/Greenhouse/Lever — NOT restaurants, NOT generic AI hype.

VOICE: human, direct, slightly confrontational. Short paragraphs. Sound like a sharp hiring-tech operator, not a content farm.
- No career-coach fluff, no "In today's competitive landscape"
- No fake testimonials or invented names/stats
- Use "you" and concrete failure modes (empty parse, ghosted after Apply)
- Soft CTA once at the end only

TARGET KEYWORD: {keyword}
ANGLE: {angle}
DATE: {today}

Return ONLY markdown in this exact shape (no code fences):

---
title: <compelling SEO title including the keyword naturally>
description: <one sentence meta description under 160 chars>
date: {today}
keyword: {keyword}
tags: [ats, resume, <one-more-tag>]
---

## <H2>
<body>

Requirements:
- 900–1400 words
- H2/H3 structure, short paragraphs, at least one checklist or table in markdown
- Primary keyword in title, first 100 words, and one H2
- Include 2–4 internal links to existing HireReady posts when relevant, e.g.
  [/blog/how-ats-resume-screening-works-2026], [/blog/ats-keyword-matching-complete-guide-2026],
  [/blog/why-resume-rejected-by-workday], [/blog/greenhouse-ats-resume-tips-2026],
  [/blog/resume-parse-errors-ats-fix-checklist], [/blog/job-application-rejection-reasons-ats-vs-human],
  [/blog/free-ats-resume-scanner-20260719], [/blog/tailor-resume-to-job-description-20260718]
- Soft CTA: [HireReady](https://hire-ready.app/#analyzer)
- Optional: one outbound link to an authority source (BLS, SHRM, or vendor docs) — no spam directories
- No frontmatter keys beyond those listed
"""


def strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:markdown|md)?\n", "", text)
        text = re.sub(r"\n```$", "", text)
    return text.strip()


def parse_title_slug(markdown: str, keyword: str, today: str) -> tuple[str, str]:
    title_m = re.search(r"^title:\s*(.+)$", markdown, re.M)
    title = (title_m.group(1).strip().strip("\"'") if title_m else keyword)
    slug = f"{slugify(title)}-{today.replace('-', '')}"
    # Prefer shorter slug from keyword if title is huge
    if len(slug) > 90:
        slug = f"{slugify(keyword)}-{today.replace('-', '')}"
    return title, slug


def write_post(markdown: str, slug: str) -> Path:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    path = BLOG_DIR / f"{slug}.md"
    if path.exists():
        path = BLOG_DIR / f"{slug}-2.md"
        slug = path.stem
    path.write_text(markdown.strip() + "\n", encoding="utf-8")
    return path


def fallback_post(topic: dict, today: str) -> str:
    keyword = topic["keyword"]
    angle = topic.get("angle", "Practical guide")
    title = keyword[0].upper() + keyword[1:]
    return f"""---
title: {title} — Practical Guide
description: {angle}. Written for job seekers fighting ATS filters.
date: {today}
keyword: {keyword}
tags: [ats, resume, guide]
---

## Why this matters

Most applications die in software before a recruiter reads them. **{keyword}** is one of the levers you can actually control.

## {angle}

1. Pull exact phrases from the job description.
2. Mirror them in skills and experience bullets you can defend in an interview.
3. Keep a single-column, parse-friendly format.
4. Re-score before you apply.

## Checklist

- [ ] Contact info is plain text under your name
- [ ] Section headings are standard (Experience, Education, Skills)
- [ ] JD hard skills appear in real bullets
- [ ] PDF exports without tables or icons-as-labels

## Next step

Run your resume against the posting with [HireReady](https://hire-ready.app/#analyzer) — free match score, gaps, and rewrite framing without fabricating experience.
"""


def already_published_today(published: dict, today: str) -> bool:
    return any(p.get("date") == today for p in published.get("published", []))


def main() -> int:
    dry = "--dry-run" in sys.argv or os.getenv("SEO_DRY_RUN") == "1"
    force_fallback = "--fallback" in sys.argv

    cfg = load_json(KEYWORDS_PATH)
    queue = load_json(QUEUE_PATH)
    published = load_json(PUBLISHED_PATH)
    today = date.today().isoformat()

    if "--once-per-day" in sys.argv and already_published_today(published, today):
        print(f"Already published today ({today}) — skip.")
        return 0

    topic = next_topic(queue, published)
    if not topic:
        print("Queue empty — nothing to publish.")
        return 0

    print(f"Topic: {topic['keyword']}")

    use_fallback = force_fallback or not os.getenv("OPENROUTER_API_KEY")
    if use_fallback:
        markdown = fallback_post(topic, today)
        print("Using fallback template (no API / --fallback).")
    else:
        try:
            raw, used_model = call_openrouter(
                build_prompt(topic, cfg, today), free_model_chain(cfg)
            )
            markdown = strip_fences(raw)
            print(f"Generated with: {used_model}")
            if not markdown.startswith("---"):
                raise RuntimeError("Model output missing frontmatter")
        except Exception as e:
            print(f"API failed ({e}); writing fallback post.")
            markdown = fallback_post(topic, today)

    title, slug = parse_title_slug(markdown, topic["keyword"], today)
    # Ensure slug uniqueness vs existing files
    base_slug = slugify(topic["keyword"]) + "-" + today.replace("-", "")
    slug = base_slug
    path = write_post(markdown, slug)

    # Remove published topic from queue
    queue["queue"] = [q for q in queue.get("queue", []) if q.get("keyword") != topic["keyword"]]
    published.setdefault("published", []).append(
        {"slug": path.stem, "keyword": topic["keyword"], "date": today, "title": title}
    )

    if dry:
        print(f"DRY RUN — wrote {path} but not updating queue/published permanently on disk? updating anyway for local test.")
    save_json(QUEUE_PATH, queue)
    save_json(PUBLISHED_PATH, published)

    print(f"Published: {path.relative_to(ROOT)}")
    print(f"URL path: /blog/{path.stem}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
