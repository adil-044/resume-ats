<p align="center">
  <img src="frontend/public/media/svg/mark.svg" alt="HireReady" width="72" height="72" />
</p>

<h1 align="center">HireReady</h1>

<p align="center">
  <strong>Stop getting ghosted by ATS.</strong><br />
  Paste a resume + job description → match score, gap keywords, AI rewrite, cover letter, PDF export.
</p>

<p align="center">
  <a href="https://hire-ready.app"><img src="https://img.shields.io/badge/Live-hire--ready.app-C4A574?style=for-the-badge" alt="Live" /></a>
  <a href="https://resume-ats-chi.vercel.app"><img src="https://img.shields.io/badge/Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
  <a href="https://hire-ready.app/blog"><img src="https://img.shields.io/badge/Blog-SEO-0C0C0B?style=for-the-badge" alt="Blog" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/FastAPI-Railway-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/GSAP-Scroll-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## Live links

| | URL |
|---|---|
| **Canonical** | [hire-ready.app](https://hire-ready.app) |
| **Vercel** | [resume-ats-chi.vercel.app](https://resume-ats-chi.vercel.app) |
| **Blog / SEO** | [hire-ready.app/blog](https://hire-ready.app/blog) |
| **Sitemap** | [hire-ready.app/sitemap.xml](https://hire-ready.app/sitemap.xml) |
| **API** | `resume-ats-production-6733.up.railway.app` |

> Prefer **hire-ready.app** for SEO. `hireready.app` is flaky on some networks.

---

## What it does

1. **Upload** PDF/DOCX resume
2. **Paste** the job description
3. Get an **ATS match score** + missing keywords
4. **AI rewrite** that frames real experience (no fabrication)
5. Export clean **markdown / PDF** + optional **cover letter**

Built for people filtered by Workday, Greenhouse, Lever — not soft career coaching.

---

## Highlights

- Graphite + paper design system (Instrument Serif · Source Sans 3)
- GSAP landing + optional R3F hero (`?hero=3d`) · isometric SVG fallbacks
- Supabase auth + resume vault / job pipeline
- FastAPI backend on Railway (OpenRouter free models)
- Daily SEO blog agent (`seo-agent/`) publishing to `/blog`

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind v4 · GSAP · R3F · Supabase |
| Backend | FastAPI · OpenRouter free-model chain (`gpt-oss-20b`, Nemotron, Gemma, `openrouter/free`) |
| Design | `#0C0C0B` graphite · `#EDE6D9` paper · `#C4A574` copper |

---

## Quick start

```bash
git clone https://github.com/adil-044/resume-ats.git
cd resume-ats/frontend && npm install && npm run dev
```

Backend (separate terminal):

```bash
cd resume-ats/backend
# set OPENROUTER_API_KEY
uvicorn app.main:app --reload --port 9000
```

Frontend env (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://127.0.0.1:9000
```

---

## Repo map

```
frontend/     Next.js app (landing, dashboard, workspace, blog)
backend/      FastAPI ATS + LLM rewrite
seo-agent/    Daily blog publisher (cron on server)
```

---

## Author

**Adil (Dean)** — Ottawa / Hamilton, Canada  
Building conversion-focused Next.js products and AI tools.

- GitHub: [@adil-044](https://github.com/adil-044)
- Hire / collab: [calendly.com/uptisement/30min](https://calendly.com/uptisement/30min)
- Sister product: [SousXChef](https://github.com/adil-044/SouSxChef) — AI agents for restaurants

---

## License

Private product code — ask before reuse. Portfolio demos welcome with credit.
