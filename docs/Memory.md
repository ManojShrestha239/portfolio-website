# Project Memory & Architectural Decision Log (`Memory.md`)

> **Agent Instruction**: Update this file at the end of every completed phase or architectural change. Keep entries concise and factual.

## Project Identity

- **Owner**: Manoj Shrestha (Senior Full-Stack Software Engineer | Enterprise SaaS & Industrial Automation Architect)
- **Stack**: Laravel 13 (PHP 8.4+), Inertia.js, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Three.js (GLSL), Lenis, GSAP ScrollTrigger, Framer Motion, MySQL 8.0, Redis + Laravel Horizon, Docker (local dev only).
- **Aesthetic**: Near-Monochrome High-Contrast Industrial Editorial Dark (`#0C0D0F` canvas, `#EDEDEF` ink, `#D97706` amber accent, 8x8 Bayer-dithered raymarched WebGL field, subtle grain, archival light `#F4F3EF` editorial shift).

## Architectural Decision Records (ADRs)

- **ADR-001 (100% Dynamic Admin CMS)**: Replaced static Markdown-file syncing with a full MySQL-backed `/admin` CMS (single-owner auth, CRUD for Projects, Articles, Resume/Skills, and Inquiries) paired with instant Redis cache invalidation on writes. _Reason_: Enables live updates from any browser while maintaining sub-100ms cached public responses.
- **ADR-002 (Dual Persistent Layouts)**: Separated `PublicLayout.tsx` (WebGL + Lenis + Framer Motion + ScopeDrawer) from `AdminLayout.tsx` (zero WebGL/Lenis). _Reason_: Keeps WebGL contexts persistent across public Inertia routes without slowing down admin data tables and forms.
- **ADR-003 (WebGL Shader Architecture)**: Single raw Three.js fragment shader (Raymarched gradient field + 8x8 Ordered Bayer dithering + procedural grain) with DPR <= 2 cap and `visibilitychange` pausing.
- **ADR-004 (Scroll & Interaction Stack)**: Paired `Lenis` + `GSAP ScrollTrigger` for scroll-scrubbed showcases, kinetic horizontal typography, and dark-to-light contrast shifts, alongside `Framer Motion` for Inertia page transitions, magnetic CTAs, and the slide-over Scope Drawer.
- **ADR-005 (Async Horizon Pipeline)**: All contact/scope notifications, uploaded image optimizations, and daily page-view aggregations execute asynchronously via Redis + Laravel Horizon.
- **ADR-006 (Docker Scope)**: Docker Compose is strictly scoped to local development parity.

## Phase Progress Tracker

- [ ] Phase 1: Local Docker Stack, Foundation & WebGL Shader Canvas
- [ ] Phase 2: Dynamic MySQL Schema, Models, Caching & Seeder
- [ ] Phase 3: Private Single-Owner `/admin` CMS
- [ ] Phase 4: Public Scroll Choreography, Contrast Shifts & Showcases
- [ ] Phase 5: Case Study Details, Technical Blog, Resume & SEO
- [ ] Phase 6: Slide-Over Scope Drawer, Horizon Queues & Production Hardening

## Active Gotchas & Constraints

- Always call `ScrollTrigger.refresh()` and reset Lenis scroll position on Inertia route transitions.
- Keep `Model::preventLazyLoading()` enabled in local dev to catch N+1 queries immediately.
- Never allow public registration routes; `/admin` is strictly single-owner.
