# Implementation Phases (`Phases.md`)

## Phase 1: Local Docker Environment, Foundation & WebGL Shader Canvas

- Configure `compose.yaml` (PHP 8.4-FPM, Nginx, MySQL 8.0, Redis, Horizon, Node 22) + Laravel 13, Inertia, React 19, TypeScript, Tailwind v4, shadcn/ui.
- Install `three`, `lenis`, `gsap`, and `framer-motion`.
- Build persistent `AppLayout.tsx` hosting `DitheredFieldCanvas.tsx` (Raymarched Gradient Field + 8x8 Ordered Bayer Dithering + Subtle Film Grain) and `SmoothScrollProvider.tsx` (Lenis + GSAP ScrollTrigger sync).
- **Exit Gate**: 60fps shader canvas renders cleanly in dark obsidian/amber palette; `docker compose up -d` and Horizon show `Active`.

## Phase 2: Data Layer & Markdown Content Sync Engine

- (Unchanged) Migrations, models, Markdown content files for Manoj's 4 flagship systems, 4 secondary systems, and 8 blog articles[cite: 1], plus `php artisan content:sync`.

## Phase 3: Scroll Choreography, Contrast Shifts & Interactive Showcases

- Implement `KineticMarqueeText.tsx` (horizontal scroll-linked oversized typography).
- Build Scroll-Scrubbed Flagship Showcases on `/` using GSAP ScrollTrigger for the 4 flagship systems[cite: 1].
- Implement Full-Bleed Dark-to-Light contrast shift (`#0C0D0F` <-> `#F4F3EF`) transitioning smoothly into the Technical Writing band.
- Build `HoverRevealRow.tsx` (interactive hover marquee + dynamic image/diagram reveal) for the Secondary Systems Index[cite: 1].
- Build `MagneticButton.tsx` and Framer Motion `PageTransition.tsx` wired to Inertia navigation.
- **Exit Gate**: Smooth 60fps scroll choreography; zero ScrollTrigger glitches across Inertia route changes; `prefers-reduced-motion` fallback verified.

## Phase 4: Technical Blog, Case Study Pages & Resume

- (Unchanged) Full case study detail views with Mermaid/SVG diagrams, blog reading experience with syntax highlighting & TOC, STAR resume page[cite: 1], and SEO/JSON-LD.

## Phase 5: Slide-Over Consultation/Scope Drawer, Horizon Queue & Hardening

- Build `ScopeDrawer.tsx` (animated slide-over/slide-out drawer) accessible globally + dedicated `/contact` page.
- Wire `SubmitInquiryAction` -> MySQL persistence -> Redis/Horizon `SendInquiryNotificationJob` + `RecordPageViewJob`.
- Run Pest tests, TypeScript check (`tsc --noEmit`), WebGL memory leak audit, and Lighthouse audit (>= 95).
