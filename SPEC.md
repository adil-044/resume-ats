# HireReady Redesign — SPEC.md

## 1. Concept & Vision

**"The ATS escape velocity tool."**
Every job seeker is stuck in gravitational pull — their resume keeps getting rejected by robots.
HireReady is the thruster that breaks them out of orbit.

The tone is **confident, direct, almost confrontational** — not corporate, not fluffy.
It speaks to someone who's been rejected 20+ times and is frustrated, not someone browsing casually.

**Tagline direction:** "Break the ATS Filter." / "Your Resume Deserves an Interview."

---

## 2. Design Language

### Aesthetic Direction
**Dark precision** — the aesthetic of a mission control dashboard meets a premium SaaS tool.
Not gaming-dark, not startup-dark. Think: Bloomberg Terminal meets Linear.app.
Confident dark backgrounds, surgical accent colors, crisp typography.

### Color Palette
```
--bg-base:       #0B0B12   (near-black, warm-tinted)
--bg-surface:    #12121C   (card surfaces)
--bg-elevated:   #1C1C2A   (elevated elements, modals)
--accent-primary:#7C3AED   (violet — primary CTA)
--accent-cyan:  #22D3EE   (cyan — secondary highlights)
--accent-coral: #F97316   (orange — urgency, warmth)
--success:       #10B981   (green — match scores)
--text-primary:  #F1F0F5   (near-white)
--text-secondary:#9090A8   (muted text)
--text-tertiary: #52525E   (very muted)
--border:        #1E1E30   (subtle borders)
--glow:          rgba(124,58,237,0.15) (violet glow)
```

### Typography
- **Display:** Syne (800 weight) — bold, distinctive, not overused
- **Body:** DM Sans (400/500) — clean, readable
- **Mono:** JetBrains Mono — for scores, code, technical data
- Fallbacks: system-ui, sans-serif

### Spatial System
- Base unit: 4px
- Section padding: 120px vertical (desktop), 80px (mobile)
- Container max-width: 1200px
- Card border-radius: 24px (cards), 16px (buttons), 12px (inputs)
- Border width: 1px (subtle borders, not shadows)

### Motion Philosophy
- **Entrance:** fade + translateY(20px), 600ms ease-out, staggered 80ms
- **Hover:** scale(1.02) on cards, brightness shift on buttons
- **Micro-interactions:** subtle pulse on live indicators, smooth progress bars
- **Scroll-driven:** sections animate on scroll-into-view (IntersectionObserver)
- NO: jarring transitions, layout shifts, or animations that block content

### Visual Assets
- Icons: Lucide React (consistent, clean)
- No emoji anywhere
- Decorative: CSS gradient meshes, subtle grid patterns, glowing orbs (CSS-only)
- No stock photos — use abstract geometric compositions or generated visuals
- Custom SVG favicon: stylized "HR" monogram

---

## 3. Layout & Structure

### Page Architecture (Mobile-First)
```
[Landing Page — Zero Nav friction]
├── Hero (100vh) — 3-second rule: H1 + single CTA
├── Stats Bar — real numbers (or honest placeholders)
├── Problem Statement — why ATS breaks your chances
├── How It Works — 3 steps, not 4
├── Live Demo — animated workflow (auto-playing)
├── Features Grid — 6 cards, not 8
├── Social Proof — real testimonials with names/companies
├── FAQ — 5 questions, accordion
├── Final CTA — repeat the hero's ask
└── Minimal Footer — logo + essential links only

[Navbar: Logo + Login only — NO navigation links on landing page]
```

### Visual Pacing
- Hero: **Loud** — big type, maximum contrast, glowing CTA
- Stats: **Calm** — quiet, factual
- Problem: **Tense** — confrontational copy, red/orange accents
- How It Works: **Ordered** — clean numbered steps
- Demo: **Interactive** — animated, engaging
- Features: **Structured** — organized grid
- Social Proof: **Warm** — human faces (illustrated), real quotes
- FAQ: **Quiet** — subtle, expandable
- CTA: **Loud again** — matches hero energy

### Responsive Strategy
- Mobile: single column, stacked sections, bottom-anchored CTAs
- Tablet (768px+): 2-column grids where applicable
- Desktop (1024px+): full layout, larger type scale
- No horizontal scrolling anywhere

---

## 4. Features & Interactions

### Hero CTA
- Primary: "Analyze My Resume — Free" → opens inline analyzer (same page, scroll to it)
- Secondary: "See How It Works" → smooth scroll to demo section
- Hover: button glows with violet halo
- Mobile: full-width buttons, stacked

### Inline Analyzer (above fold in hero for returning users)
- File upload: drag-and-drop zone with visual feedback
- Job description: textarea with placeholder guidance
- Submit: disabled until both fields filled
- Loading: animated progress with status messages
- Result: reveals match score inline with upsell to full dashboard

### Live Demo Section
- Auto-playing 4-step animated walkthrough
- Step indicators: clickable dots + step labels
- Transitions: smooth crossfade between steps
- Each step shows: icon, label, animated screen mockup

### FAQ Accordion
- Single-open accordion (opening one closes others)
- Smooth height animation
- Chevron rotation indicator
- Border separators between items

### Contact Form
- Fields: Name, Email, Message (3 fields only — no friction tax)
- Inline validation on blur
- Submit button: loading state during submission
- Success: replaces form with confirmation message
- Error: inline error messages, no page reload

### Mobile Menu
- NOT a hamburger menu that opens a full nav
- Simple overlay with essential links only (Login, Get Started)
- Touch-friendly tap targets (48px minimum)

---

## 5. Component Inventory

### Button
- States: default, hover (glow + brightness), active (scale 0.98), disabled (opacity 0.4), loading (spinner)
- Variants: primary (violet fill), secondary (border only), ghost (text only)
- Sizes: sm (36px), md (48px), lg (56px)

### Card (Feature/Testimonial)
- Background: --bg-surface with 1px --border
- Hover: border brightens to --accent-primary at 30% opacity, subtle lift
- No heavy shadows — use borders and glow effects instead

### Input / Textarea
- Background: --bg-elevated
- Border: 1px --border, focus: --accent-primary
- Placeholder: --text-tertiary
- Error: red border + error message below

### Accordion Item
- Closed: question text + chevron-down
- Open: question text + chevron-up + answer revealed with animation
- Divider: 1px border between items

### Navbar (Landing)
- Logo (left) + Login (right) only
- Transparent background, blurs to solid on scroll
- Mobile: same — no hamburger, just two elements

### Footer
- 3 columns: Brand | Quick Links | Legal
- Social icons: GitHub, LinkedIn, Twitter (X)
- Newsletter: email input + submit (if applicable)
- Minimal padding, no decorative elements

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Animation:** Framer Motion (existing)
- **Auth:** Supabase (existing)
- **Payments:** Stripe (existing, can ignore since free)
- **Fonts:** next/font/google (Syne, DM Sans, JetBrains Mono)

### Architecture Decisions
- Single-page landing with sections (anchor links)
- Blog section at /blog for SEO (future)
- `/auth/login` stays as-is (don't redesign auth flows)
- `/dashboard`, `/workspace` stay as-is (product app, not landing)
- Global CSS variables for theming
- Component-level animations via Framer Motion

### Performance Targets
- LCP < 2.5s (hero text + CTA visible immediately)
- CLS < 0.05 (no layout shift from fonts or images)
- FID < 100ms (no heavy JS blocking interaction)
- Lighthouse Performance score: 90+

### Analytics Ready (installed on day one)
- PostHog snippet in layout (can be toggled)
- Vercel Analytics (already available via Vercel)
- No GA4 until domain is confirmed

