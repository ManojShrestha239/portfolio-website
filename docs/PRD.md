# Product Requirements Document (PRD) — Manoj Shrestha Engineering Portfolio

## 1. Product Vision

Build a fast, authoritative, dark-mode personal engineering portfolio and technical blog for **Manoj Shrestha** (Senior Full-Stack Software Engineer | Enterprise SaaS & Industrial Automation Architect)[cite: 1]. The site must communicate senior systems-engineering depth immediately—avoiding generic agency/AI visual clichés—and convert technical recruiters, CTOs, and enterprise clients into direct inquiries.

## 2. Target Audience

- Engineering Managers, VPs of Engineering, and CTOs hiring Staff/Senior Full-Stack & Backend Architects.
- Enterprise B2B clients seeking SaaS modernization, multi-tenant architecture, or industrial hardware-to-web integration[cite: 1].
- Senior developers reading deep-dive technical essays on Laravel, MySQL, and systems design[cite: 1].

## 3. Core Features & Scope

### 3.1 Public Portfolio Pages (Inertia + React 19)

- **Home / Dossier Index (`/`)**: Concise engineering positioning statement, live system-metric strip (10 paint brands, 500+ dealer terminals, 95% ETL speedup, 51% API reduction)[cite: 1], curated flagship case studies, selected secondary systems, and recent technical essays.
- **Case Studies (`/work` and `/work/{slug}`)**: Deep-dive architectural pages featuring Problem Statement, Architectural Solution, interactive SVG/Mermaid system diagrams, code/SQL snippets, and verified impact metrics for the 4 flagship systems[cite: 1].
- **Engineering Log / Blog (`/writing` and `/writing/{slug}`)**: Markdown-backed technical articles with syntax highlighting, reading time, table of contents, and category filtering (SaaS, Industrial IoT, Security, Performance) covering the 8-article editorial roadmap[cite: 1].
- **Resume / Experience (`/resume`)**: Structured STAR-method experience timeline, Core Technical Skills Matrix[cite: 1], and an async-generated or cached downloadable PDF resume.
- **Direct Inquiry (`/contact`)**: Minimal, spam-protected contact form (honeypot + rate limiting) backed by MySQL persistence and queued Redis/Horizon email + notification delivery.

### 3.2 Admin / Content Operations (Minimal)

- CLI/Markdown-first content pipeline for Case Studies and Blog Posts (stored in `content/` and synced to MySQL via `php artisan content:sync` for fast indexed querying and full-text search).
- Laravel Horizon dashboard (`/horizon`) protected by gate authentication for monitoring queued contact notifications and analytics jobs.

### 3.3 Interactive Experience & Conversion Upgrades

- **Persistent Ambient Craft**: Real-time WebGL raymarched + Bayer-dithered dark backdrop with subtle film grain visible across hero and footer zones.
- **Scroll-Choreographed Flagship Showcase**: Visitors scrub through Manoj's 4 flagship systems (Paint Tinting Suite, FieldMA SaaS, Bikram Sambat Date Engine, Bihani Licensing Gateway)[cite: 1] with smooth Lenis scrolling, kinetic typography dividers, and a full-bleed dark-to-light contrast shift into the Technical Writing section.
- **Interactive Systems Index**: Hovering over secondary systems (Painter Loyalty QR, NYEF Portal, Thrift Store, WP Everest)[cite: 1] activates a smooth hover marquee and floating architecture preview.
- **Global Consultation / Project Scope Drawer**: Accessible from any header CTA via a fluid slide-over drawer; lets prospective clients/recruiters toggle scope tags (e.g., _Multi-Tenant SaaS_, _Industrial Hardware Integration_, _Security Audit_, _Senior Engineering Role_), attach project details, and trigger an asynchronous Redis/Horizon notification pipeline.

## 4. Non-Functional Requirements

- **Performance**: First Contentful Paint < 1.0s; Lighthouse Performance, Accessibility, and Best Practices >= 95.
- **SEO**: Dynamic OpenGraph meta tags, JSON-LD `Person` & `TechArticle` structured data, XML sitemap.
- **Accessibility**: WCAG 2.1 AA contrast ratios in dark mode (>= 4.5:1 for body text), full keyboard navigation, `prefers-reduced-motion` compliance.
