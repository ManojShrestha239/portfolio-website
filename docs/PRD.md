# Product Requirements Document (PRD) — Manoj Shrestha Dynamic Engineering Portfolio

## 1. Product Vision

Build a 100% dynamic, authoritative, dark-mode personal engineering portfolio, technical blog, and private Admin CMS for **Manoj Shrestha** (Senior Full-Stack Software Engineer | Enterprise SaaS & Industrial Automation Architect). The public experience pairs museum-grade WebGL shader art and scroll choreography with zero AI visual clichés, converting CTOs, hiring managers, and enterprise clients into direct inquiries.

## 2. Target Audience

- Engineering Managers, VPs of Engineering, and CTOs hiring Staff/Senior Full-Stack & Backend Architects.
- Enterprise B2B clients seeking SaaS modernization, multi-tenant architecture, or industrial hardware-to-web integration.
- Senior developers reading deep-dive technical essays on Laravel, MySQL, security, and systems design.

## 3. Core Public Features (Inertia + React 19 + WebGL)

- **Hero & Telemetry Index (`/`)**: Oversized editorial positioning statement over a real-time WebGL raymarched + Bayer-dithered dark field with subtle film grain, plus a live dynamic metric strip (10 paint brands, 500+ dealer terminals, 95% ETL speedup, 51% API reduction).
- **Scroll-Scrubbed Flagship Showcases**: GSAP ScrollTrigger-scrubbed showcases of the 4 flagship engineering systems (Paint Tinting Suite, FieldMA SaaS, Bikram Sambat Date Engine, Bihani Licensing Gateway), separated by horizontal scroll kinetic typography.
- **Full-Bleed Dark-to-Light Research & Writing Band**: Smooth theme/background contrast shift (`#0C0D0F` <-> `#F4F3EF`) highlighting technical articles, linking to `/writing` and `/writing/{slug}` with syntax highlighting, sticky Table of Contents, and tag filtering.
- **Interactive Secondary Systems Index**: Hover marquee + masked image-reveal rows for secondary projects (Painter Loyalty QR, NYEF Portal, Thrift Store, WP Everest) linking to full `/work/{slug}` case studies with Mermaid/SVG diagrams.
- **Dynamic Resume (`/resume`)**: Database-backed STAR experience timeline, Core Technical Skills Matrix, and downloadable active CV PDF.
- **Global Slide-Over Project Scope Drawer & Contact (`/contact`)**: Accessible from any page via magnetic CTA buttons; allows visitors to toggle engagement scope tags (_Multi-Tenant SaaS_, _Industrial Automation_, _Security Audit_, _Senior Engineering Role_), submit inquiries to MySQL, and trigger async Redis + Horizon email/notification delivery.

## 4. Private Dynamic Admin CMS (`/admin`)

- **Single-Owner Auth**: Private `/admin/login` with no public registration.
- **Projects CRUD**: Create, edit, reorder (`sort_order`), toggle `is_flagship` / `is_published`, edit metrics JSON, Mermaid diagrams, and upload preview images (auto-optimized via Horizon).
- **Articles CRUD**: Markdown editor with live preview, tag management, auto-calculated reading time, draft/published toggle.
- **Resume & Skills CRUD**: Manage experience entries, skill categories, and active downloadable CV PDF.
- **Inquiries & Scope Inbox**: Review incoming submissions from the Scope Drawer and `/contact`, filter by status (`new`, `in_review`, `replied`, `archived`), and add internal notes.
- **Horizon Monitoring**: Gate-protected `/horizon` dashboard for background queues.

## 5. Non-Functional Requirements

- **Performance**: Public TTFB < 100ms via Redis caching; 60fps WebGL/scroll choreography; Lighthouse Performance, Accessibility, and Best Practices >= 95.
- **SEO**: Dynamic OpenGraph tags, JSON-LD (`Person`, `TechArticle`), and dynamic XML sitemap.
- **Accessibility**: WCAG 2.1 AA contrast ratios in both obsidian dark and archival light bands, full keyboard navigation, and strict `prefers-reduced-motion` fallbacks.
