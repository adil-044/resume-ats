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
DEFAULT_MODEL = "tencent/hy3:free"


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


def call_openrouter(prompt: str, model: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError("Install openai: pip install openai") from e

    client = OpenAI(api_key=api_key, base_url=OPENROUTER_BASE)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    content = (response.choices[0].message.content or "").strip()
    if not content:
        raise RuntimeError("OpenRouter returned empty content")
    return content


def build_prompt(topic: dict, cfg: dict, today: str) -> str:
    keyword = topic["keyword"]
    angle = topic.get("angle", "")
    return f"""You write SEO blog posts for HireReady (hireready.app), an ATS resume analyzer.

GENRE: job seekers, ATS filters, resume keywords, Workday/Greenhouse/Lever — NOT restaurants, NOT generic AI hype.

VOICE: confrontational clarity, practical, terse. No career-coach fluff. No fake testimonials with invented names.
Do not fabricate statistics; if you cite a number, qualify it as industry-reported or illustrative.
Soft CTA once at the end linking to https://hireready.app/#analyzer

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
- Internal link markdown: [HireReady](https://hireready.app/#analyzer)
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

Run your resume against the posting with [HireReady](https://hireready.app/#analyzer) — free match score, gaps, and rewrite framing without fabricating experience.
"""


def main() -> int:
    dry = "--dry-run" in sys.argv or os.getenv("SEO_DRY_RUN") == "1"
    force_fallback = "--fallback" in sys.argv

    cfg = load_json(KEYWORDS_PATH)
    queue = load_json(QUEUE_PATH)
    published = load_json(PUBLISHED_PATH)
    today = date.today().isoformat()

    topic = next_topic(queue, published)
    if not topic:
        print("Queue empty — nothing to publish.")
        return 0

    model = cfg.get("model", DEFAULT_MODEL)
    print(f"Topic: {topic['keyword']}")

    if force_fallback or dry and not os.getenv("OPENROUTER_API_KEY"):
        markdown = fallback_post(topic, today)
        print("Using fallback template (no API / --fallback).")
    else:
        try:
            markdown = strip_fences(call_openrouter(build_prompt(topic, cfg, today), model))
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
