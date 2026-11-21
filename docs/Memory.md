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

- [x] Phase 1: Local Docker Stack, Foundation & WebGL Shader Canvas
  - *Completed (2026-11-21)*: Authored local Docker stack (`compose.yaml`, `docker/php/Dockerfile`, `docker/php/php.ini`, `docker/nginx/default.conf`) for PHP 8.4-FPM, Nginx, MySQL 8.0, Redis, Horizon worker, and Node 22.
  - Initialized Laravel 13.43, Inertia.js v3.7, Laravel Horizon v5.52, React 19, TypeScript 7 (strict, no `baseUrl`), Tailwind CSS v4, shadcn/ui primitives, Three.js, Lenis, GSAP ScrollTrigger, and Framer Motion.
  - Built persistent `PublicLayout.tsx` hosting `DitheredFieldCanvas.tsx` (custom GLSL raymarched gradient field + analytic 8x8 Ordered Bayer dithering + procedural animated film grain, DPR <= 2, visibility/off-screen pause, `prefers-reduced-motion` static frame fallback) and `SmoothScrollProvider.tsx` (Lenis + GSAP ticker + Inertia navigation reset).
  - Verified with `npm run types`, `npm run build`, and `php artisan test` (3 passed, 14 assertions).
- [x] Phase 2: Dynamic MySQL Schema, Models, Caching & Seeder
  - *Completed (2026-11-21)*: Created 8 schema migrations (`users.is_owner`, `projects`, `articles`, `experiences`, `skill_groups`, `site_settings`, `inquiries`, `page_views` with composite unique `(path, viewed_date)` index) and strictly typed Eloquent models (`User`, `Project`, `Article`, `Experience`, `SkillGroup`, `SiteSetting`, `Inquiry`, `PageView`).
  - Built readonly PHP DTOs (`app/Data/`), safe CommonMark `MarkdownRenderer`, Redis-backed `PortfolioQueryService`, and `ClearPortfolioCacheAction` for instant cache invalidation.
  - Authored idempotent `PortfolioContentSeeder` pre-populating Manoj Shrestha's verified owner account, 4 flagship case studies (with Mermaid diagrams), 4 secondary systems, 8 technical articles, STAR experience timeline, 4 skill groups, and site settings.
  - Wired `HomeController` to cached DTOs and verified with `migrate:fresh --seed`, `php artisan test` (6 passed, 42 assertions), `npm run types`, and `npm run build`.
- [x] Phase 3: Private Single-Owner `/admin` CMS
  - *Completed (2026-11-21)*: Built single-owner auth (`/admin/login`, `EnsurePortfolioOwner` middleware, Redis `admin-login` rate limiter, public `/register` disabled) and fast zero-WebGL/zero-Lenis `AdminLayout.tsx`.
  - Implemented full CRUD for Projects (with metrics, Mermaid diagrams, randomized preview image upload + async `OptimizeUploadedMediaJob` on Horizon `media` queue), Articles (Markdown editor + live split preview + reading-time estimator), Resume/Experiences/SkillGroups/CV PDF, and Inquiries Scope Inbox.
  - Verified instant Redis cache invalidation across all writes with `php artisan test` (13 passed), `npm run types`, and `npm run build`.
- [ ] Phase 4: Public Scroll Choreography, Contrast Shifts & Showcases
- [ ] Phase 5: Case Study Details, Technical Blog, Resume & SEO
- [ ] Phase 6: Slide-Over Scope Drawer, Horizon Queues & Production Hardening

## Active Gotchas & Constraints

- Always call `ScrollTrigger.refresh()` and reset Lenis scroll position on Inertia route transitions.
- Keep `Model::preventLazyLoading()` enabled in local dev to catch N+1 queries immediately.
- Never allow public registration routes; `/admin` is strictly single-owner.
- Laravel 13 cache deserialization defaults to `allowed_classes => false` (`__PHP_Incomplete_Class` if objects are cached directly); always cache plain scalar arrays in Redis and hydrate readonly DTOs via `fromArray()`.
