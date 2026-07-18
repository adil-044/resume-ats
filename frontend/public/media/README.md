# HireReady cinematic + SVG media

Drop files here. GSAP / components auto-pick by convention.

## Hero
- `hero/loop.mp4` — muted looping background (preferred over SVG)
- `hero/poster.jpg` — still / poster
- `hero/overlay.png` — optional transparent overlay
- Fallback: isometric SVG at `svg/hero-scene.svg` (default)
- Opt-in R3F: add `?hero=3d` to URL

## SVG set (generated — geometric isometric, Impeccable-safe)
| File | Use |
|---|---|
| `svg/hero-scene.svg` | Hero plate |
| `svg/resume-stack.svg` | How-it-works |
| `svg/resume-single.svg` | Modular |
| `svg/match-gauge.svg` | Proof teaser |
| `svg/mark.svg` | Navbar / favicon mark |

Technique inspired by [TomasHubelbauer/svg-3d](https://github.com/TomasHubelbauer/svg-3d) isometric projection — clean polygons, no sketch filters.

## Dashboard ambient
- `dashboard/ambient.mp4` or `dashboard/texture.jpg`

## Ambient scroll scenes
- `ambient/scene-01.jpg` … `scene-03.jpg`

## Design system
See root `PRODUCT.md` + `DESIGN.md` (Impeccable init). Skill: `pbakaus/impeccable`.
