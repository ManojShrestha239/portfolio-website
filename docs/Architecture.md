# System Architecture — Manoj Shrestha Dynamic Portfolio

## 1. Tech Stack Overview

- **Backend**: Laravel 13 (PHP 8.4+), `declare(strict_types=1);`, Invokable Controllers, Form Requests, Action Classes, Readonly DTOs.
- **Frontend Bridge**: Inertia.js (server-driven SPA routing with shared persistent layouts).
- **UI & Creative Tech**: React 19, TypeScript (strict mode), Tailwind CSS v4, shadcn/ui primitives, raw Three.js (GLSL WebGL shaders), Lenis (smooth scroll), GSAP ScrollTrigger, Framer Motion.
- **Database**: MySQL 8.0 (100% dynamic content, inquiries, resume data, and daily aggregated page views).
- **Cache & Queues**: Redis + Laravel Horizon (cached public DTO payloads with instant invalidation on admin edits, async contact notifications, image optimization, and page-view aggregation).
- **Local Development Only**: Docker Compose (`app` PHP 8.4-FPM, `nginx`, `mysql`, `redis`, `horizon`, `node`).

## 2. Dual Persistent Layout Architecture

To keep the public site visually extraordinary and the admin CMS razor-fast:

- **`PublicLayout.tsx` (Persistent)**: Mounts `DitheredFieldCanvas.tsx` (single shared Three.js `WebGLRenderer`), `SmoothScrollProvider.tsx` (Lenis + GSAP ScrollTrigger), Framer Motion `PageTransition.tsx`, and the global slide-over `ScopeDrawer.tsx`. WebGL contexts never recreate during Inertia navigation.
- **`AdminLayout.tsx` (Persistent)**: Uses the exact same Industrial Editorial Dark tokens (`#0C0D0F`, `#121417`, `#23272F`, `#D97706`) with **zero WebGL** and **zero Lenis**, featuring a crisp sidebar, shadcn data tables, and instant form responsiveness.

## 3. Data & Cache Invalidation Flow

- **Public Reads**: Request -> Thin Invokable Controller -> Query Service reads Redis cache (`portfolio:projects:published`, `portfolio:articles:published`, etc.) -> falls back to MySQL -> returns typed Readonly DTO via `Inertia::render()`.
- **Admin Writes**: `/admin/*` Form Submission -> `FormRequest` validation -> `App\Actions\Admin\*` persists to MySQL -> immediately busts affected Redis cache tags/keys -> dispatches `OptimizeUploadedMediaJob` (if media uploaded) to Horizon.
- **Public Inquiries & Telemetry**: `POST /inquiries` -> `StoreInquiryRequest` (honeypot + Redis rate limit) -> `SubmitInquiryAction` persists to MySQL -> dispatches `SendInquiryNotificationJob` to Horizon. Page views dispatch `RecordPageViewJob` to Horizon.

## 4. Database Schema (MySQL 8.0)

- `users`: Single-owner admin account (`id`, `name`, `email`, `password`, `is_owner`).
- `projects`: `id`, `slug` (unique), `title`, `category`, `is_flagship` (bool), `summary`, `metrics_json`, `tech_stack_json`, `body_markdown`, `body_html`, `diagram_mermaid`, `preview_image_path`, `sort_order`, `published_at`, `timestamps`.
- `articles`: `id`, `slug` (unique), `title`, `excerpt`, `target_audience`, `tags_json`, `body_markdown`, `body_html`, `reading_time_mins`, `published_at`, `timestamps`.
- `experiences`: `id`, `role_title`, `organization`, `period`, `highlights_json`, `sort_order`, `timestamps`.
- `skill_groups`: `id`, `category`, `skills_json`, `sort_order`, `timestamps`.
- `site_settings`: `key` (unique), `value_json` (stores hero headline, telemetry metrics, active CV PDF path, availability status).
- `inquiries`: `id`, `name`, `email`, `company`, `scope_tags_json`, `message`, `ip_hash`, `status`, `admin_notes`, `timestamps`.
- `page_views`: `id`, `path`, `referrer_domain`, `viewed_date`, `count` (unique composite index on `path, viewed_date`).

## 5. Key Directory Boundaries

- `app/Actions/Admin/` — `UpsertProjectAction`, `DeleteProjectAction`, `UpsertArticleAction`, `UpdateInquiryStatusAction`, `ClearPortfolioCacheAction`.
- `app/Actions/Public/` — `SubmitInquiryAction`.
- `app/Data/` — Readonly PHP DTOs (`ProjectData`, `ArticleData`, `ResumeData`, `InquiryData`).
- `app/Jobs/` — `SendInquiryNotificationJob`, `OptimizeUploadedMediaJob`, `RecordPageViewJob`.
- `database/seeders/PortfolioContentSeeder.php` — Seeds Manoj Shrestha's verified 4 flagship case studies, 4 secondary systems, 8 blog articles, and resume/skills data.
- `resources/js/webgl/` — `DitheredFieldCanvas.tsx`, `shaders/raymarchDither.vert`, `shaders/raymarchDither.frag`.
- `resources/js/motion/` — `SmoothScrollProvider.tsx`, `PageTransition.tsx`, `MagneticButton.tsx`, `KineticMarqueeText.tsx`, `HoverRevealRow.tsx`.
- `resources/js/components/domain/` — `ScopeDrawer.tsx`, `MermaidDiagram.tsx`, `MetricStrip.tsx`.
