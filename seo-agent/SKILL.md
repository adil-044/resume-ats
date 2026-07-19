---
name: hireready-seo
description: >-
  Generate and publish HireReady SEO blog posts (ATS/resume genre) into
  frontend/content/blog. Use when user asks for daily SEO posts, blog content,
  or the HireReady SEO agent.
---

# HireReady SEO Agent

## When to use

- "Write today's HireReady SEO post"
- "Run the SEO agent"
- "Queue more ATS blog topics"

## Steps

1. Work in repo `resume-ats` (local `/root/resume-ats` or clone).
2. Read `seo-agent/PLAYBOOK.md` + `seo-agent/queue.json`.
3. Run:

```bash
cd <resume-ats-root>
python seo-agent/generate_post.py
# or offline:
python seo-agent/generate_post.py --fallback
```

4. Confirm new file under `frontend/content/blog/`.
5. Commit + push so Vercel deploys `/blog/<slug>`.
6. Optionally update vault `HireReady.md` + daily log.

## Genre lock

ATS, resumes, Workday/Greenhouse/Lever, keyword matching — **not** restaurant/SousXChef topics.

## Voice

Confrontational clarity. Soft CTA to `/#analyzer`. No fake testimonials.
