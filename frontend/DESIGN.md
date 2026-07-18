# DESIGN.md — HireReady

## Visual theme
Graphite stage + copper signal + paper artifact. Dark ambient lighting (desk at night). The resume is the light object.

## Color (OKLCH-aligned hex)
| Role | Hex | Use |
|---|---|---|
| bg-base | `#0C0C0B` | Page / app shell |
| bg-surface | `#161614` | Panels |
| paper | `#EDE6D9` | Resume plates, modals |
| paper-ink | `#1A1814` | Text on paper |
| signal | `#C4A574` | CTA / focus |
| text | `#F2EFE8` | Primary on graphite |
| muted | `#A39E93` | Secondary |

## Typography
- Display: Instrument Serif
- Body: Source Sans 3
- Mono: JetBrains Mono (scores)

## Motion
GSAP timelines + ScrollTrigger. R3F hero optional. Media parallax when assets present. `prefers-reduced-motion` required.

## Components
- Signal button (copper fill, graphite text)
- Paper panel (modal / quote)
- Surface panel (dark bordered)
- Isometric SVG scene (semantic illustration — geometric, not sketch)

## Assets
- `/public/media/hero/*` — film plates
- `/public/media/svg/*` — isometric SVG set
- `/public/media/ambient/*` — scroll scrub stills
