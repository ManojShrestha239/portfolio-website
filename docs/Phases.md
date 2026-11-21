# Implementation Phases (`Phases.md`)

## Phase 1: Local Docker Stack, Foundation & WebGL Shader Canvas

- Configure `compose.yaml` (PHP 8.4-FPM, Nginx, MySQL 8.0, Redis, Horizon worker, Node 22).
- Initialize Laravel 13, Inertia.js, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, `three`, `lenis`, `gsap`, and `framer-motion`.
- Configure `Design.md` theme tokens, typography, and `PublicLayout.tsx` hosting `DitheredFieldCanvas.tsx` (Raymarched Field + 8x8 Ordered Bayer Dithering + Subtle Grain) and `SmoothScrollProvider.tsx`.
- Verify Redis + Laravel Horizon (`/horizon`) status.
- **Exit Gate**: `docker compose up -d` boots cleanly; Horizon is `Active`; 60fps dithered shader renders with `prefers-reduced-motion` fallback.

## Phase 2: Dynamic MySQL Schema, Models, Caching & Seeder

- Create migrations and Eloquent models for `users`, `projects`, `articles`, `experiences`, `skill_groups`, `site_settings`, `inquiries`, and `page_views`.
- Build `PortfolioContentSeeder` pre-populating Manoj Shrestha's 4 flagship case studies, 4 secondary systems, 8 blog articles, resume experience, and skills matrix.
- Build Readonly DTOs (`app/Data/`) and Redis-backed read services + `ClearPortfolioCacheAction`.
- **Exit Gate**: `php artisan migrate:fresh --seed` populates MySQL cleanly; Pest tests verify cached reads and instant cache busting.

## Phase 3: Private Single-Owner `/admin` CMS

- Implement single-owner auth (`/admin/login`, `EnsurePortfolioOwner` middleware, disabled registration) and `AdminLayout.tsx` (fast editorial dark UI, no WebGL/Lenis).
- Build dynamic CRUD interfaces for Projects (with preview image upload + `OptimizeUploadedMediaJob` via Horizon), Articles (Markdown editor + live preview), Resume/Skills/CV PDF, and Inquiries Inbox.
- **Exit Gate**: Creating/editing a project or article in `/admin` immediately invalidates Redis cache and updates the live site; Pest feature tests pass for auth and CRUD.

## Phase 4: Public Scroll Choreography, Contrast Shifts & Showcases

- Build Home Page (`/`) reading dynamic DTOs from Redis/MySQL:
  - Oversized editorial Hero + live Telemetry Metric Strip.
  - `KineticMarqueeText.tsx` (horizontal scroll-linked oversized display text).
  - Scroll-Scrubbed Flagship Showcases (GSAP ScrollTrigger) for flagship projects.
  - Full-Bleed Dark-to-Light contrast shift (`#0C0D0F` <-> `#F4F3EF`) for Research & Technical Writing Highlights.
  - `HoverRevealRow.tsx` (interactive hover marquee + masked image-reveal) for Secondary Systems Index.
  - `MagneticButton.tsx` and Framer Motion `PageTransition.tsx` synced with Inertia navigation.
- **Exit Gate**: 60fps scroll choreography; zero ScrollTrigger glitches across Inertia route changes; zero AI clichés.

## Phase 5: Case Study Details, Technical Blog, Resume & SEO

- Build `/work/{slug}` (structured architectural breakdown + dark-themed Mermaid/SVG renderer) and `/writing` + `/writing/{slug}` (tag filtering, sticky TOC, syntax-highlighted code blocks).
- Build `/resume` (dynamic STAR timeline, Skills Matrix, downloadable CV PDF from `site_settings`).
- Add dynamic OpenGraph meta tags, JSON-LD (`Person`, `TechArticle`), and dynamic XML sitemap.
- **Exit Gate**: All seeded flagship studies, secondary projects, articles, and resume views render cleanly on desktop and mobile.

## Phase 6: Slide-Over Scope Drawer, Horizon Queues & Production Hardening

- Build global `ScopeDrawer.tsx` (animated slide-over/slide-out drawer) and `/contact` page wired to `StoreInquiryRequest` (honeypot + Redis rate limit) and `SubmitInquiryAction`.
- Wire `SendInquiryNotificationJob` and `RecordPageViewJob` through Redis + Laravel Horizon.
- Execute full Pest test suite, `tsc --noEmit`, WebGL memory-leak verification, and Lighthouse audit (>= 95).
- **Exit Gate**: Submitting the Scope Drawer persists to MySQL, appears in `/admin/inquiries`, and processes notification jobs cleanly in Horizon.
