# Design System — "Industrial Editorial Dark"

## 1. Visual Philosophy

This portfolio is designed like a **printed Swiss technical monograph rendered on an obsidian drafting table**. Authority comes from restraint, grid precision, typography, and real system diagrams—never from decorative glows or animation gimmicks.

## 2. Color Palette (Anti-AI Dark Mode)

No pure black (`#000000`). No purple/cyan neon gradients.

- **Canvas Base**: `#0C0D0F` (Deep Charcoal Obsidian)
- **Surface / Card**: `#121417` (Elevated Graphite)
- **Surface Hover**: `#181B20`
- **Hairline Borders**: `#23272F` (Crisp 1px structural dividers)
- **Primary Text**: `#EDEDEF` (Off-white, prevents halation eye strain)
- **Secondary Text**: `#9CA3AF` (Technical Slate)
- **Muted / Telemetry Text**: `#6B7280`
- **Primary Accent (Used Sparingly)**: `#D97706` (Industrial Amber — status dots, active indicators, key metric callouts)
- **Semantic Status**: Success `#10B981`, Error `#EF4444`

## 3. Typography

- **Display / Headings**: `Instrument Serif` or `Space Grotesk` (tight editorial tracking `-0.02em`, crisp weight contrast).
- **Body**: `Geist Sans` or `Plus Jakarta Sans` (16px base, `1.65` line-height, max measure `68ch` for reading comfort).
- **Code & Technical Telemetry**: `JetBrains Mono` (used for dates, version tags, SQL/PHP snippets, and metric labels like `ETL: 45s / 64MB RAM`).

## 4. Layout & Spacing Rules

- **Hairline Structural Grid**: Use visible 1px `#23272F` borders separating major sections instead of floating rounded drop-shadow cards.
- **Border Radius**: Sharp & deliberate (`rounded-sm` / `2px` to `4px` max). Ban `rounded-2xl` pill-heavy SaaS bloat.
- **Whitespace**: Generous vertical rhythm (`py-20` to `py-28` between sections) so dense technical information breathes.

## 5. Motion & Interaction Rules

- Ban scroll-jacking, parallax gimmicks, and bouncy spring animations.
- Transitions limited to crisp `150ms ease-out` color/border shifts on hover and subtle underline reveals.
- Respect `@media (prefers-reduced-motion: reduce)` globally.

## 6. Hard Visual Bans (Rejection Criteria)

- NO radial gradient blobs or glowing background meshes.
- NO `backdrop-blur` glassmorphism cards.
- NO gradient-filled headline text.
- NO stock 3D illustrations or abstract AI avatars.
- NO skill percentage bars or star ratings.

## 7. WebGL & Shader Backdrop Specification (Part 1)

- **Raymarched Gradient Field**: Custom GLSL fragment shader rendered via Three.js (`ShaderMaterial`) on a full-bleed fixed `<canvas>` behind the hero and footer bands. Uses smooth signed distance fields (SDF) / domain warping animated slowly (`uTime * 0.15`) in obsidian (`#0C0D0F`), deep slate (`#161920`), and restrained amber (`#D97706` at <= 18% luminance).
- **Ordered Bayer / Error-Diffusion Dithering**: Apply an 8x8 Ordered Bayer matrix threshold pass inside the same fragment shader over the raymarched luminance values to produce crisp, tactile, retro-industrial halftone banding (eliminating smooth 8-bit gradient banding and AI-blob softness).
- **Subtle Animated Film Grain**: Composite high-frequency procedural hash noise (`opacity: 0.035–0.05`) in the shader or lightweight CSS overlay so dark surfaces feel physical and printed.

## 8. Scroll Choreography & Micro-Interactions (Part 2)

- **Lenis Smooth Scrolling**: Inertia-based scrolling (`lerp: 0.08`, `smoothWheel: true`) synced directly to `gsap.ticker` and `ScrollTrigger.update`.
- **Horizontal Scroll Kinetic Typography**: Oversized edge-to-edge display typography (e.g., `SYSTEMS ARCHITECT — INDUSTRIAL SAAS`) translating smoothly along the X-axis tied to vertical scroll velocity/progress (`scrub: 1`).
- **Scroll-Scrubbed Flagship Showcases**: Pin and scrub the 4 flagship engineering case studies (Paint Tinting Suite, FieldMA SaaS, Bikram Sambat Engine, Bihani Gateway) via GSAP ScrollTrigger so architectural layers, metrics, and diagrams progress in lockstep with scroll.
- **Full-Bleed Dark-to-Light Contrast Shifts**: Smoothly animate CSS custom properties (`--bg-canvas`, `--text-primary`, `--border-hairline`) via ScrollTrigger when entering the "Technical Writing / Deep-Dive Editorial" band—shifting from Obsidian Dark (`#0C0D0F`) to Warm Archival Paper (`#F4F3EF`) and back to dark cleanly.
- **Interactive Hover Marquee & Image-Reveal Rows**: On the Secondary Systems & Domain Index rows, hovering triggers a subtle horizontal marquee of the tech stack while revealing a cursor-following, masked preview card of the system diagram/UI.
- **Magnetic CTA Buttons**: Primary action buttons ("Start a Technical Inquiry", "Inspect Architecture") subtly attract toward cursor coordinates (`max displacement: 8px`, damped spring return).
- **Fluid Page Transitions**: Framer Motion `<AnimatePresence mode="wait">` curtain/opacity-transform transitions integrated with Inertia page keys.
- **Slide-Over Consultation / Scope Drawer**: Hardware-accelerated slide-over/slide-out drawer (built on shadcn `Sheet`/Radix Dialog + Framer Motion easing) allowing CTOs/clients to build a project inquiry or consultation scope from any route without losing scroll context.
