# Engineering & AI Agent Rules (`Rules.md`)

## 1. Backend (Laravel 13 / PHP 8.4+)

- Every PHP file MUST start with `declare(strict_types=1);`.
- Controllers MUST be thin and invokable or strictly RESTful; zero raw Eloquent queries or business logic in controllers.
- Validate all incoming HTTP requests via dedicated `FormRequest` classes.
- Never send emails or execute slow I/O synchronously inside an HTTP request; dispatch a queued Job to Redis/Horizon.
- All database queries must avoid N+1 problems (`Model::preventLazyLoading(!app()->isProduction())` enabled in `AppServiceProvider`).

## 2. Frontend (React 19 + TypeScript + Tailwind v4)

- Strict TypeScript mode enabled; `any` and `@ts-ignore` are strictly forbidden.
- Use shadcn/ui primitives ONLY for accessible interactive behaviors (Dialog, Sheet, Command Palette, Tabs); override all default styling with `Design.md` tokens.
- Keep components small and single-purpose. Extract repeated markup into `resources/js/components/domain/`.
- Never hardcode hex colors inside TSX files; always reference semantic CSS variables/Tailwind theme tokens defined in `app.css`.

## 3. Content & Authenticity

- Never invent fake testimonials, fake client logos, or placeholder Latin (`Lorem ipsum`).
- Use ONLY verified facts, project names, and metrics from Manoj Shrestha's dossier[cite: 1].
- Tone of copy: calm, precise, senior engineering voice. Zero hype words ("passionate", "rockstar", "revolutionary", "seamless").

## 4. Docker & Local Environment

- Docker Compose is strictly for local development (`compose.yaml`). Never commit `.env` secrets or production credentials.
- Redis must be configured as the default `CACHE_STORE` and `QUEUE_CONNECTION` for Horizon processing.

## 5. Verification Before Completion

- Before marking any task done, run:
  1. `php artisan test` (Pest/PHPUnit feature tests passing)
  2. `npm run types` (`tsc --noEmit` with zero errors)
  3. `npm run build` (clean Vite production bundle)

## 6. WebGL, Shaders & Animation Guardrails

- **Strict GPU Budget**: Clamp `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Pause the `requestAnimationFrame` loop when `document.hidden === true` or when the shader canvas is scrolled completely off-screen (`IntersectionObserver`).
- **Zero Memory Leaks**: Always dispose Three.js `BufferGeometry`, `ShaderMaterial`, and `WebGLRenderer` on cleanup; always wrap GSAP animations in `gsap.context()` inside `useLayoutEffect` / `useEffect` and revert on unmount.
- **Inertia + ScrollTrigger Hygiene**: Every page component using `ScrollTrigger` must clean up triggers on unmount and call `ScrollTrigger.refresh()` after Inertia transition completion.
- **Accessibility First (`prefers-reduced-motion`)**: If the user prefers reduced motion, freeze the shader on a crisp static dithered frame, disable Lenis smooth scroll, disable kinetic horizontal shifts, and fall back to instant opacity transitions.
- **Touch Device Guard**: Disable magnetic cursor pull and hover image-reveal floating previews on touch devices (`(hover: hover) and (pointer: fine)` media query check).
