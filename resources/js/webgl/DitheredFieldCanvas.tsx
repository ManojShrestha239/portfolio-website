import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from './shaders/raymarchDither.vert?raw';
import fragmentShader from './shaders/raymarchDither.frag?raw';
import {
    QUALITY_BUDGETS,
    useFieldConsole,
    type DitherMode,
    type FieldConsoleSettings,
} from '@/context/FieldConsoleContext';

const DITHER_INDEX: Record<DitherMode, number> = {
    off: 0,
    bayer8: 1,
    diffusion: 2,
};

function srgbVector(hex: string): THREE.Vector3 {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new THREE.Vector3(r, g, b);
}

export function DitheredFieldCanvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { settings, updateTelemetry, registerExporter } = useFieldConsole();
    const settingsRef = useRef<FieldConsoleSettings>(settings);
    const applySettingsRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        settingsRef.current = settings;
        applySettingsRef.current?.();
    }, [settings]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: false,
                depth: false,
                stencil: false,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: true,
            });
        } catch {
            updateTelemetry({
                supported: false,
                running: false,
                fps: 0,
                width: 0,
                height: 0,
            });
            return;
        }

        renderer.setPixelRatio(1);
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setClearColor(0x0c0d0f, 1);

        const canvas = renderer.domElement;
        canvas.className = 'block h-full w-full [image-rendering:pixelated]';
        canvas.setAttribute('aria-hidden', 'true');
        container.appendChild(canvas);

        const uniforms = {
            uResolution: { value: new THREE.Vector2(1, 1) },
            uTime: { value: 6.2 },
            uPointer: { value: new THREE.Vector2(0, 0) },
            uIntensity: { value: settingsRef.current.intensity },
            uGrain: { value: settingsRef.current.grain },
            uAmber: { value: settingsRef.current.amber },
            uLevels: { value: settingsRef.current.levels },
            uDitherMode: { value: DITHER_INDEX[settingsRef.current.dither] },
            uDitherScale: { value: 1 },
            uSteps: { value: QUALITY_BUDGETS[settingsRef.current.quality].steps },
            uPaper: { value: 0 },
            uCanvasDark: { value: srgbVector('#0C0D0F') },
            uInkDark: { value: srgbVector('#EDEDEF') },
            uCanvasLight: { value: srgbVector('#F4F3EF') },
            uInkLight: { value: srgbVector('#14161A') },
            uAccent: { value: srgbVector('#D97706') },
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            depthTest: false,
            depthWrite: false,
        });

        const quad = new THREE.Mesh(geometry, material);
        quad.frustumCulled = false;

        const scene = new THREE.Scene();
        scene.add(quad);
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const pTarget = new THREE.Vector2(0, 0);
        const pCurrent = new THREE.Vector2(0, 0);

        let rafId = 0;
        let running = false;
        let contextLost = false;
        let pageVisible = document.visibilityState !== 'hidden';
        let inView = true;
        let lastTs = 0;
        let elapsed = 6.2;
        let statAcc = 0;
        let frames = 0;
        let currentWidth = 0;
        let currentHeight = 0;

        const resize = (): void => {
            const rect = container.getBoundingClientRect();
            const cssW = Math.max(1, rect.width);
            const cssH = Math.max(1, rect.height);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const active = settingsRef.current;
            const budget =
                QUALITY_BUDGETS[active.quality].pixels *
                (active.dither === 'diffusion' ? 0.5 : 1);
            const scale = Math.min(dpr, Math.sqrt(budget / (cssW * cssH)));
            const w = Math.max(2, Math.round(cssW * scale));
            const h = Math.max(2, Math.round(cssH * scale));

            renderer.setSize(w, h, false);
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            uniforms.uResolution.value.set(w, h);
            uniforms.uDitherScale.value = Math.max(1, Math.round(2 * scale));
            currentWidth = w;
            currentHeight = h;
        };

        const applyUniforms = (): void => {
            const active = settingsRef.current;
            uniforms.uIntensity.value = active.intensity;
            uniforms.uGrain.value = active.grain;
            uniforms.uAmber.value = active.amber;
            uniforms.uLevels.value = active.levels;
            uniforms.uDitherMode.value = DITHER_INDEX[active.dither];
            uniforms.uSteps.value = QUALITY_BUDGETS[active.quality].steps;
            if (!active.parallax) {
                pTarget.set(0, 0);
            }
        };

        const renderOnce = (): void => {
            if (contextLost) {
                return;
            }
            const paperTarget = document.documentElement.dataset.band === 'archival' ? 1 : 0;
            uniforms.uPaper.value = paperTarget;
            renderer.render(scene, camera);
        };

        const shouldRun = (): boolean =>
            !contextLost &&
            pageVisible &&
            inView &&
            settingsRef.current.motion &&
            !reducedMotionQuery.matches;

        const stop = (): void => {
            if (!running) {
                return;
            }
            running = false;
            window.cancelAnimationFrame(rafId);
            rafId = 0;
            updateTelemetry({
                supported: true,
                running: false,
                fps: 0,
                width: currentWidth,
                height: currentHeight,
            });
        };

        const frame = (ts: number): void => {
            rafId = window.requestAnimationFrame(frame);
            const dt = lastTs === 0 ? 1 / 60 : Math.min((ts - lastTs) / 1000, 0.05);
            lastTs = ts;
            elapsed += dt;

            pCurrent.lerp(pTarget, 1 - Math.exp(-dt * 4.5));
            uniforms.uTime.value = elapsed;
            uniforms.uPointer.value.copy(pCurrent);

            const paperTarget = document.documentElement.dataset.band === 'archival' ? 1 : 0;
            uniforms.uPaper.value +=
                (paperTarget - uniforms.uPaper.value) * (1 - Math.exp(-dt * 5));

            renderer.render(scene, camera);
            frames += 1;
            statAcc += dt;

            if (statAcc >= 0.35) {
                updateTelemetry({
                    supported: true,
                    running: true,
                    fps: Math.round(frames / statAcc),
                    width: currentWidth,
                    height: currentHeight,
                });
                statAcc = 0;
                frames = 0;
            }
        };

        const start = (): void => {
            if (running || !shouldRun()) {
                return;
            }
            running = true;
            lastTs = 0;
            rafId = window.requestAnimationFrame(frame);
        };

        const sync = (): void => {
            if (shouldRun()) {
                start();
            } else {
                stop();
                renderOnce();
            }
        };

        applySettingsRef.current = () => {
            applyUniforms();
            resize();
            sync();
            if (!running) {
                renderOnce();
            }
        };

        registerExporter((filename: string) => {
            renderOnce();
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = filename;
            a.click();
        });

        const handlePointerMove = (event: PointerEvent): void => {
            if (!settingsRef.current.parallax || reducedMotionQuery.matches) {
                return;
            }
            pTarget.set(
                Math.min(Math.max((event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1, -1), 1),
                Math.min(Math.max(1 - (event.clientY / Math.max(window.innerHeight, 1)) * 2, -1), 1),
            );
        };

        const handleVisibility = (): void => {
            pageVisible = document.visibilityState !== 'hidden';
            sync();
        };

        const handleContextLost = (event: Event): void => {
            event.preventDefault();
            contextLost = true;
            stop();
        };

        const handleContextRestored = (): void => {
            contextLost = false;
            resize();
            applyUniforms();
            sync();
        };

        const resizeObserver = new ResizeObserver(() => {
            resize();
            if (!running) {
                renderOnce();
            }
        });
        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                inView = entries[0]?.isIntersecting ?? true;
                sync();
            },
            { threshold: 0 },
        );
        intersectionObserver.observe(container);

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);
        reducedMotionQuery.addEventListener('change', sync);
        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        applyUniforms();
        resize();
        sync();
        renderOnce();

        return () => {
            applySettingsRef.current = null;
            registerExporter(null);
            stop();
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            window.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('visibilitychange', handleVisibility);
            reducedMotionQuery.removeEventListener('change', sync);
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);

            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (canvas.parentNode === container) {
                container.removeChild(canvas);
            }
        };
    }, [registerExporter, updateTelemetry]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-canvas"
        />
    );
}
