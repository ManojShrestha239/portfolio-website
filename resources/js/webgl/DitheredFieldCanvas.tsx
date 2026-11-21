import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from './shaders/raymarchDither.vert?raw';
import fragmentShader from './shaders/raymarchDither.frag?raw';

interface ShaderUniforms {
    [uniform: string]: THREE.IUniform<unknown>;
    uTime: THREE.IUniform<number>;
    uResolution: THREE.IUniform<THREE.Vector2>;
    uPointer: THREE.IUniform<THREE.Vector2>;
    uScroll: THREE.IUniform<number>;
    uReducedMotion: THREE.IUniform<number>;
}

export function DitheredFieldCanvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);

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
                powerPreference: 'high-performance',
                depth: false,
                stencil: false,
            });
        } catch {
            // Graceful fallback when WebGL context is unavailable (e.g. headless environments)
            return;
        }

        const clampedDpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(clampedDpr);
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.domElement.className = 'block h-full w-full';
        renderer.domElement.setAttribute('aria-hidden', 'true');
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

        const uniforms: ShaderUniforms = {
            uTime: { value: 0 },
            uResolution: {
                value: new THREE.Vector2(
                    container.clientWidth * clampedDpr,
                    container.clientHeight * clampedDpr,
                ),
            },
            uPointer: { value: new THREE.Vector2(0.5, 0.5) },
            uScroll: { value: 0 },
            uReducedMotion: { value: reducedMotionQuery.matches ? 1.0 : 0.0 },
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            depthWrite: false,
            depthTest: false,
        });

        const quad = new THREE.Mesh(geometry, material);
        scene.add(quad);

        const pointerTarget = new THREE.Vector2(0.5, 0.5);
        const pointerCurrent = new THREE.Vector2(0.5, 0.5);

        let isVisible = true;
        let isHidden = document.hidden;
        let rafId: number | null = null;
        let lastFrameTime = performance.now();

        const renderStaticFrame = (): void => {
            renderer.render(scene, camera);
        };

        const stopLoop = (): void => {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const tick = (now: number): void => {
            if (isHidden || !isVisible || reducedMotionQuery.matches) {
                rafId = null;
                return;
            }

            const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
            lastFrameTime = now;

            uniforms.uTime.value += deltaSeconds;

            pointerCurrent.lerp(pointerTarget, 0.06);
            uniforms.uPointer.value.copy(pointerCurrent);

            const maxScroll = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1,
            );
            uniforms.uScroll.value = window.scrollY / maxScroll;

            renderer.render(scene, camera);
            rafId = window.requestAnimationFrame(tick);
        };

        const startLoop = (): void => {
            if (reducedMotionQuery.matches) {
                uniforms.uReducedMotion.value = 1.0;
                renderStaticFrame();
                return;
            }
            if (rafId === null && !isHidden && isVisible) {
                uniforms.uReducedMotion.value = 0.0;
                lastFrameTime = performance.now();
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const handleResize = (): void => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            renderer.setPixelRatio(dpr);
            renderer.setSize(width, height, false);
            uniforms.uResolution.value.set(width * dpr, height * dpr);

            if (reducedMotionQuery.matches) {
                renderStaticFrame();
            }
        };

        const handlePointerMove = (event: PointerEvent): void => {
            if (!finePointerQuery.matches || reducedMotionQuery.matches) {
                return;
            }
            pointerTarget.set(
                event.clientX / Math.max(window.innerWidth, 1),
                1.0 - event.clientY / Math.max(window.innerHeight, 1),
            );
        };

        const handleVisibilityChange = (): void => {
            isHidden = document.hidden;
            if (isHidden) {
                stopLoop();
            } else {
                startLoop();
            }
        };

        const handleReducedMotionChange = (): void => {
            if (reducedMotionQuery.matches) {
                stopLoop();
                uniforms.uReducedMotion.value = 1.0;
                renderStaticFrame();
            } else {
                uniforms.uReducedMotion.value = 0.0;
                startLoop();
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) {
                    return;
                }
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { threshold: 0.01 },
        );
        observer.observe(container);

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

        startLoop();

        return () => {
            stopLoop();
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);

            geometry.dispose();
            material.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-canvas"
        />
    );
}
