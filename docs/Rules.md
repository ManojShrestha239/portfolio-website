# Engineering, Security & Motion Rules (`Rules.md`)

## 1. Backend (Laravel 13 / PHP 8.4+)

- Every PHP file MUST declare `declare(strict_types=1);`.
- Controllers MUST be thin and invokable or strictly RESTful; zero raw Eloquent queries or business logic in controllers.
- Validate all public and admin requests with dedicated `FormRequest` classes.
- Enable `Model::preventLazyLoading(!app()->isProduction())` in `AppServiceProvider`.
- Every `/admin` write operation MUST invalidate affected Redis cache keys via `ClearPortfolioCacheAction`.
- Dispatch all emails, media optimizations, and page-view writes asynchronously to Redis + Laravel Horizon.

## 2. Admin Security & Uploads

- Protect `/admin/*` with `auth` and `EnsurePortfolioOwner` middleware; disable public `/register` routes.
- Validate all image and PDF uploads by strict MIME type, file size limit, and randomized storage filenames (prevent path traversal).
- Rate-limit `/admin/login` and `POST /inquiries` via Redis rate limiters + honeypot field on public forms.

## 3. Frontend (React 19 + TypeScript + Tailwind v4)

- Strict TypeScript mode enabled; `any` and `@ts-ignore` are strictly forbidden.
- Use shadcn/ui primitives for accessible interactions (Sheet, Dialog, Command, Table, Tabs), completely overriding default zinc/ring styles with `Design.md` tokens.
- Never hardcode hex colors inside TSX; always reference semantic CSS variables / Tailwind theme tokens.

## 4. WebGL, Shaders & Motion Guardrails

- Clamp `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
- Pause the shader `requestAnimationFrame` loop when `document.hidden === true` or off-screen (`IntersectionObserver`).
- Dispose Three.js geometry, materials, and renderer cleanly on unmount; wrap all GSAP animations in `gsap.context()` and revert on cleanup.
- Honor `@media (prefers-reduced-motion: reduce)`: freeze WebGL shader on a static dithered frame, disable Lenis smooth scrolling, disable kinetic X-shifts, and use simple opacity transitions.
- Restrict magnetic CTAs and hover image-reveal previews to `@media (hover: hover) and (pointer: fine)`.
- NEVER mount WebGL or Lenis inside `AdminLayout.tsx`.

## 5. Content Authenticity & Verification Gates

- Never fabricate metrics, client logos, or Lorem ipsum; use ONLY verified data from Manoj Shrestha's dossier.
- Before marking any phase complete, run and pass:
  1. `php artisan test`
  2. `npm run types` (`tsc --noEmit`)
  3. `npm run build`
