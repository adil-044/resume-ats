# HireReady SEO / GEO Playbook

> Same system as SousXChef SEO GEO — different genre: **ATS, resumes, job applications**.

Mirror structure: revenue keywords → pillar posts → distribution → GEO citations → daily publishing agent.

---

## Key revenue keywords

| Priority | Keyword | Difficulty |
|---|---|---|
| CRITICAL | ATS resume checker | Medium |
| CRITICAL | resume keyword optimizer | Medium |
| CRITICAL | how ATS resume screening works | Low |
| HIGH | ATS keyword matching | Low |
| HIGH | resume rejected by Workday | Low |
| HIGH | free ATS resume scanner | Medium |
| HIGH | tailor resume to job description | Medium |
| MEDIUM | Greenhouse ATS resume tips | Low |
| MEDIUM | resume parse errors ATS | Low |
| MEDIUM | cover letter for ATS | Low |
| MEDIUM | job application rejection reasons | Medium |

---

## 8 pillar posts (genre: career / ATS)

1. **"How ATS Resume Screening Actually Works in 2026"** — main SEO pillar ✅ seeded
2. **"ATS Keyword Matching: The Complete 2026 Guide"** ✅ seeded
3. **"Why Your Resume Gets Rejected by Workday (And How to Fix It)"** ✅ seeded
4. **"Stop Guessing: Tailor Your Resume to Every Job Description"**
5. **"Greenhouse & Lever: What Recruiters' ATS Actually Reads"**
6. **"The Job Seeker's AI Toolkit (2026) — Without the Slop"**
7. **"Case Study: Score 42 → 91 Before the Interview"**
8. **"10 Signs Your Resume Is Dying in the ATS"**

Daily agent fills supporting posts around these pillars (long-tails, comparisons, how-tos).

---

## Voice (must match product)

- Confrontational clarity: “Stop getting ghosted by ATS.”
- No soft career-coach fluff
- No fabricated case studies with fake names unless marked hypothetical
- Soft CTA to HireReady analyze — never hard-sell spam
- Graphite/paper editorial tone in titles

---

## Reddit / community distribution

**Priority subs:**
1. r/jobs
2. r/resumes
3. r/careerguidance
4. r/recruitinghell
5. r/cscareerquestions
6. r/JobSeeking

**Rules:** pain-first hook, answer in comments, no drive-by links on day one.

**Pain hooks:**
- "Workday says submitted but I never hear back"
- "My resume looks great to humans and dies in ATS"
- "I keep changing keywords and still get ghosted"

---

## GEO (Perplexity / Claude citations)

1. Publish pillar + daily supporting content on `/blog`
2. Clear definitions, checklists, original framing
3. Internal links between pillar posts
4. Directory / comparison pages later (vs Jobscan framing — we rewrite, not only score)

---

## Agent pipeline

```
seo-agent/queue.json  →  generate_post.py  →  frontend/content/blog/*.md  →  /blog/[slug]
```

- **Local:** `python seo-agent/generate_post.py`
- **Daily:** GitHub Action `.github/workflows/seo-daily.yml` (cron 14:00 UTC)
- Requires secret `OPENROUTER_API_KEY` (same stack as Railway backend)

---

## Tags

#seo #geo #content-marketing #hireready #ats #resume
