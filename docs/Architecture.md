# System Architecture — Manoj Shrestha Portfolio

## 1. Tech Stack Overview

- **Backend**: Laravel 13 (PHP 8.4+), strict typing (`declare(strict_types=1)`).
- **Frontend Bridge**: Inertia.js v3 (server-driven routing, zero separate REST boilerplate).
- **UI Layer**: React 19, TypeScript (strict mode), Tailwind CSS v4, shadcn/ui primitives (Radix UI unstyled behaviors, heavily customized tokens).
- **Database**: MySQL 8.0 (structured metadata for projects, articles, inquiries, and lightweight privacy-first page-view telemetry).
- **Queues & Cache**: Redis + Laravel Horizon (background job processing, response/content caching, rate limiting).
- **Local Development Only**: Docker Compose (`app` PHP-FPM, `nginx`, `mysql`, `redis`, `horizon`, `node/vite`). Production deploys natively or via standard VPS/cloud without requiring local dev containers.

## 2. High-Level Request & Data Flow

1. Browser requests route (e.g., `/work/fieldma-saas`).
2. Laravel Route -> Invokable Controller -> Domain Service/Repository (reads cached DTO from Redis; falls back to MySQL).
3. Controller returns `Inertia::render('Work/Show', ['project' => ProjectData::from($project)])`.
4. React 19 renders page layout with strict TypeScript props and zero client-side data waterfalls.
5. Side effects (e.g., `POST /contact`, view-count increment) dispatch lightweight Jobs (`SendInquiryNotificationJob`, `RecordPageViewJob`) to Redis, processed asynchronously by Laravel Horizon.

## 3. Directory Structure (Key Boundaries)

- `app/Actions/` — Single-responsibility business actions (`SubmitInquiryAction`, `SyncMarkdownContentAction`).
- `app/Data/` — Readonly PHP DTOs representing Inertia payloads.
- `app/Http/Controllers/` — Thin invokable controllers (no business logic or raw queries).
- `app/Jobs/` — Queued Horizon jobs (`SendInquiryNotificationJob`, `RecordPageViewJob`).
- `content/projects/` & `content/articles/` — Source-of-truth Markdown + YAML frontmatter files.
- `resources/js/pages/` — Inertia page components.
- `resources/js/components/ui/` — Customized shadcn/ui primitives.
- `resources/js/components/domain/` — Bespoke portfolio components (ArchitectureDiagram, MetricStrip, TechnicalTable).
- `resources/js/types/` — Strict TypeScript interfaces mirroring PHP DTOs.

## 4. Database Schema (Core Tables)

- `projects`: `id`, `slug` (unique), `title`, `category`, `is_flagship` (bool), `summary`, `metrics_json`, `tech_stack_json`, `body_html`, `diagram_mermaid`, `sort_order`, `published_at`.
- `articles`: `id`, `slug` (unique), `title`, `excerpt`, `target_audience`, `tags_json`, `body_html`, `reading_time_mins`, `published_at`.
- `inquiries`: `id`, `name`, `email`, `company`, `message`, `ip_hash`, `status`, `created_at`.
- `page_views`: `id`, `path`, `referrer_domain`, `viewed_date`, `count` (aggregated daily via Horizon to keep table tiny).

## 5. Frontend Creative-Tech Layer (Inertia + React 19)

To prevent WebGL context loss and scroll glitches during SPA navigation, all global motion engines live inside a **Persistent Inertia Layout** (`resources/js/layouts/AppLayout.tsx`):

- `resources/js/webgl/`
  - `DitheredFieldCanvas.tsx` — Single shared Three.js `WebGLRenderer` with `OrthographicCamera`, custom `vertex.glsl` and `fragment.glsl` (raymarched field + 8x8 Bayer dithering + procedural grain). Disposes geometry/materials cleanly on unmount.
- `resources/js/motion/`
  - `SmoothScrollProvider.tsx` — Initializes `Lenis`, binds `gsap.ticker`, and listens to Inertia `router.on('navigate')` to reset scroll position and invoke `ScrollTrigger.refresh()`.
  - `PageTransition.tsx` — Wraps Inertia page children in Framer Motion `AnimatePresence` keyed by `usePage().url`.
  - `MagneticButton.tsx` — Reusable magnetic pointer-tracking wrapper for primary CTAs.
  - `KineticMarqueeText.tsx` — Scroll-linked horizontal edge-to-edge typography component.
  - `HoverRevealRow.tsx` — Interactive category/project row with hover marquee and floating diagram preview.
- `resources/js/components/domain/ScopeDrawer.tsx`
  - Global slide-over drawer (replaces e-commerce Cart/RFQ pattern with an Engineering Consultation & Project Scope Builder). Submits via Inertia `useForm` to `POST /inquiries` -> MySQL -> Redis/Horizon `SendInquiryNotificationJob`.

### Additional Frontend Packages

- `three`, `@types/three` (raw Three.js kept lean—no bloated 3D scene libraries needed for a full-screen fragment shader).
- `lenis` (smooth inertia scroll).
- `gsap` (ScrollTrigger for scroll-scrubbed showcases, kinetic horizontal text, and dark-to-light background interpolation).
- `framer-motion` (fluid Inertia page transitions, magnetic spring physics, and slide-over drawer motion).
