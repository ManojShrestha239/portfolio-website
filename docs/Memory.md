# Project Memory & Architectural Decision Log (`Memory.md`)

> **Agent Instruction**: Update this file at the end of every completed phase or significant architectural change. Keep entries concise and factual.

## Project Identity

- **Owner**: Manoj Shrestha (Senior Full-Stack Software Engineer | Enterprise SaaS & Industrial Automation Architect)[cite: 1]
- **Stack**: Laravel 13, Inertia.js, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, MySQL 8.0, Redis + Horizon, Docker (local dev only).
- **Aesthetic**: Industrial Editorial Dark (`#0C0D0F` base, `#D97706` amber accent, 1px hairline grids, zero AI glows/gradients).

## Architectural Decision Records (ADRs)

- **ADR-001 (Content Storage)**: Chosen Markdown files in `content/` synced to MySQL via `php artisan content:sync` rather than a full WYSIWYG CMS. _Reason_: Version-controlled technical writing in Git with fast SQL querying and Redis caching.
- **ADR-002 (Background Jobs)**: All contact emails and daily page-view aggregations are routed through Redis + Laravel Horizon. _Reason_: Keeps public Inertia responses under 100ms and showcases real production queue architecture.
- **ADR-003 (Docker Scope)**: Docker Compose is strictly scoped to local development to guarantee parity across PHP 8.4, MySQL 8.0, and Redis without bloating production infrastructure.
- **ADR-004 (WebGL Architecture)**: Implemented a single raw Three.js fragment shader (Raymarched SDF field + 8x8 Bayer dithering + procedural grain) mounted in the persistent Inertia `AppLayout` rather than per-page `@react-three/fiber` canvases. _Reason_: Keeps bundle size minimal, avoids WebGL context recreation flicker during Inertia transitions, and guarantees 60fps performance.
- **ADR-005 (Scroll & Transition Choreography)**: Paired `Lenis` + `GSAP ScrollTrigger` for scroll-scrubbed showcases, kinetic typography, and dark-to-light theme shifts, alongside `Framer Motion` for Inertia page transitions, magnetic CTAs, and the slide-over Consultation/Scope Drawer.
- **ADR-006 (Portfolio Adaptation of RFQ Drawer)**: Adapted the slide-over Cart/RFQ drawer pattern into a global Engineering Consultation & Project Scope Drawer connected to Laravel Horizon so enterprise visitors can scope inquiries from any page.

## Phase Progress Tracker

- [ ] Phase 1: Local Docker Environment & Foundation
- [ ] Phase 2: Data Layer & Markdown Content Sync Engine
- [ ] Phase 3: Core Portfolio UI & Editorial Case Studies
- [ ] Phase 4: Technical Blog, Resume & Interactive Polish
- [ ] Phase 5: Async Contact Pipeline, Telemetry & Hardening

## Known Gotchas & Constraints

- Ensure `Model::preventLazyLoading()` is active in local dev to catch N+1 queries early.
- Keep shadcn/ui components strictly stripped of default zinc/purple ring tokens to match `Design.md`.
