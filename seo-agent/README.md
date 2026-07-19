# HireReady SEO Agent

Daily (or on-demand) SEO blog publisher for **HireReady** — same system shape as the SousXChef SEO/GEO playbook, **ATS / resume / job-application genre**.

## What it does

1. Picks next topic from `queue.json`
2. Writes a markdown post via OpenRouter (or `--fallback` template)
3. Saves to `frontend/content/blog/<slug>.md`
4. Records it in `published.json`
5. Site serves it at `/blog/<slug>` (Vercel picks up on deploy)

## Local run

```bash
cd /path/to/resume-ats
export OPENROUTER_API_KEY=sk-or-...
pip install openai   # if needed
python seo-agent/generate_post.py
```

No key / offline:

```bash
python seo-agent/generate_post.py --fallback
```

## Local daily cron (this machine)

Script: `seo-agent/run_daily.sh`  
Cron: `0 13 * * *` (09:00 America/Toronto / 13:00 UTC)

```bash
# put key for AI posts (optional — without it uses --fallback)
cp seo-agent/.env.example seo-agent/.env
# edit: OPENROUTER_API_KEY=...

# manual run
seo-agent/run_daily.sh

# logs
tail -f seo-agent/logs/daily.log
```

GitHub Action file still optional; local cron is the primary daily publisher here.

## Files

| File | Role |
|---|---|
| `PLAYBOOK.md` | Keywords, pillars, voice, GEO |
| `keywords.json` | Agent config |
| `queue.json` | Upcoming topics |
| `published.json` | History (dedupe) |
| `generate_post.py` | Publisher |

## Cursor / loop

In a Cursor session you can run:

```text
/loop 1d run python seo-agent/generate_post.py in resume-ats and push if a new post was written
```

Prefer GitHub Action for unattended daily posts.
