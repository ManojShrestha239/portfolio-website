import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    type PropsWithChildren,
} from 'react';
import { router } from '@inertiajs/react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export type ScrollProgressListener = (progress: number) => void;

interface SmoothScrollContextValue {
    readonly scrollTo: (target: number | string | HTMLElement) => void;
    readonly subscribeProgress: (listener: ScrollProgressListener) => () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({ children }: PropsWithChildren) {
    const lenisRef = useRef<Lenis | null>(null);
    const listenersRef = useRef<Set<ScrollProgressListener>>(new Set());

    const emitProgress = useCallback((progress: number): void => {
        const clamped = Math.min(Math.max(progress, 0), 1);
        listenersRef.current.forEach((listener) => listener(clamped));
    }, []);

    useEffect(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const computeNativeProgress = (): number => {
            const scrollable = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                0,
            );
            return scrollable > 0 ? window.scrollY / scrollable : 0;
        };

        if (reducedMotionQuery.matches) {
            const onNativeScroll = (): void => emitProgress(computeNativeProgress());
            onNativeScroll();
            window.addEventListener('scroll', onNativeScroll, { passive: true });
            const removeNavigate = router.on('navigate', () => emitProgress(0));
            return () => {
                removeNavigate();
                window.removeEventListener('scroll', onNativeScroll);
            };
        }

        // Frame-rate independent time-based easing for consistent 60Hz / 120Hz / 144Hz / 240Hz feel
        const lenis = new Lenis({
            duration: 0.95,
            easing: (t: number): number => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.6,
            autoRaf: false,
        });

        lenisRef.current = lenis;

        const handleLenisScroll = (): void => {
            ScrollTrigger.update();
            emitProgress(lenis.progress);
        };

        lenis.on('scroll', handleLenisScroll);

        // Drive Lenis directly on GSAP's native-refresh-rate rAF ticker (supports 144Hz+ uncapped)
        const tickerCallback = (time: number): void => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        const removeNavigateListener = router.on('navigate', () => {
            lenis.scrollTo(0, { immediate: true, force: true });
            emitProgress(0);
            window.requestAnimationFrame(() => {
                lenis.resize();
                ScrollTrigger.refresh();
            });
        });

        const handleReducedMotionChange = (): void => {
            if (reducedMotionQuery.matches) {
                lenis.stop();
            } else {
                lenis.start();
            }
        };

        reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
        emitProgress(computeNativeProgress());

        return () => {
            removeNavigateListener();
            reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
            lenis.off('scroll', handleLenisScroll);
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [emitProgress]);

    const scrollTo = useCallback((target: number | string | HTMLElement): void => {
        const lenis = lenisRef.current;
        if (lenis) {
            lenis.scrollTo(target, {
                offset: typeof target === 'number' ? 0 : -84,
                duration: 1.05,
                force: true,
            });
            return;
        }
        if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: 'auto' });
        } else if (typeof target === 'string') {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: 'auto' });
        } else {
            target.scrollIntoView({ behavior: 'auto' });
        }
    }, []);

    const subscribeProgress = useCallback((listener: ScrollProgressListener): (() => void) => {
        listenersRef.current.add(listener);
        return () => {
            listenersRef.current.delete(listener);
        };
    }, []);

    const value = useMemo<SmoothScrollContextValue>(
        () => ({ scrollTo, subscribeProgress }),
        [scrollTo, subscribeProgress],
    );

    return (
        <SmoothScrollContext.Provider value={value}>
            {children}
        </SmoothScrollContext.Provider>
    );
}

export function useSmoothScroll(): SmoothScrollContextValue {
    const context = useContext(SmoothScrollContext);
    if (!context) {
        throw new Error('useSmoothScroll must be used inside SmoothScrollProvider.');
    }
    return context;
}
