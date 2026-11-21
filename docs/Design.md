# Design System — "Near-Monochrome Industrial Editorial Dark"

## 1. Aesthetic Philosophy

Designed like a **Swiss technical monograph printed on obsidian stock, paired with GPU-rendered halftone hardware precision**. Authority comes from near-monochrome high contrast, ordered dithering, oversized editorial typography, generous negative space, and real system diagrams—never decorative AI glows.

## 2. Color Palette & Contrast Shift Tokens

- **Dark Canvas Base (Default)**: `#0C0D0F` (Obsidian Charcoal — NEVER pure `#000000`)
- **Dark Elevated Surface**: `#121417` | Hover: `#181B20`
- **Dark Hairline Borders**: `#23272F` (Crisp 1px structural dividers)
- **Dark Primary Ink**: `#EDEDEF` | Secondary: `#9CA3AF` | Telemetry Muted: `#6B7280`
- **Archival Light Band (Full-Bleed Contrast Shift)**: Canvas `#F4F3EF` | Ink `#111317` | Hairline `#D6D3CD`
- **Restrained Accent**: `#D97706` (Industrial Amber — active telemetry dots, focus indicators, subtle shader highlights <= 18% luminance)
- **Semantic**: Success `#10B981`, Error `#EF4444`

## 3. Typography

- **Oversized Editorial Display**: `Instrument Serif` or `Space Grotesk` (tight tracking `-0.03em`, dramatic scale up to `clamp(3.2rem, 8vw, 7.5rem)` for Hero and Kinetic Marquee bands).
- **Body**: `Geist Sans` or `Plus Jakarta Sans` (`16px` base, `1.65` line-height, `68ch` max reading measure).
- **Telemetry & Code**: `JetBrains Mono` (system metrics, version badges, SQL/PHP code blocks, table headers).

## 4. WebGL & Shader Animations (Part 1 — Public Layout)

- **Raymarched Gradient Field**: Custom GLSL fragment shader via Three.js `ShaderMaterial` using slow domain-warped SDF/noise fields (`uTime * 0.12`) strictly in near-monochrome obsidian/graphite with faint amber warmth.
- **Ordered Bayer / Floyd-Steinberg Dithering**: 8x8 Ordered Bayer threshold matrix pass applied directly inside the fragment shader over luminance values for crisp halftone industrial texture.
- **Subtle Animated Film Grain**: Procedural high-frequency hash grain (`opacity: 0.035–0.05`) composited cleanly without muddying typography.

## 5. Scroll Choreography & Micro-Interactions (Part 2 — Public Layout)

- **Lenis Smooth Scrolling**: Inertia scrolling (`lerp: 0.08`, `smoothWheel: true`) synced to `gsap.ticker` and `ScrollTrigger.update`.
- **Horizontal Scroll Kinetic Typography**: Edge-to-edge oversized display text translating smoothly along X tied to vertical scroll progress (`scrub: 1`).
- **Scroll-Scrubbed Flagship Showcases**: GSAP ScrollTrigger pinned/scrubbed architecture reveals for flagship systems.
- **Full-Bleed Dark-to-Light Contrast Shifts**: Smooth CSS variable interpolation (`#0C0D0F` <-> `#F4F3EF`) entering and exiting the Research & Technical Writing band.
- **Interactive Hover Marquee & Image-Reveal Rows**: Secondary project rows trigger a smooth horizontal tech-stack marquee and a masked cursor-following preview image on hover (desktop pointer-fine only).
- **Magnetic CTA Buttons**: Subtle cursor attraction (`max 8px`) with damped spring return.
- **Fluid Page Transitions**: Framer Motion `<AnimatePresence mode="wait">` transitions synced with Inertia page keys.
- **Slide-Over / Slide-Out Drawer**: Hardware-accelerated Scope/Consultation Drawer sliding cleanly from the right edge (`shadcn Sheet` + Framer Motion easing).

## 6. Hard Visual Bans (Rejection Criteria)

- NO pure `#000000` backgrounds or neon purple/cyan gradients.
- NO radial glow blobs or `backdrop-blur` glassmorphism cards.
- NO gradient-clipped headline text (`bg-clip-text text-transparent`).
- NO skill percentage bars, star ratings, or stock 3D avatars.
- Sharp deliberate radii (`2px`–`4px` max; ban `rounded-2xl` bloat).
