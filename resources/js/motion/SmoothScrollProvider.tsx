import { useEffect, type PropsWithChildren } from 'react';
import { router } from '@inertiajs/react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotionQuery.matches) {
            return;
        }

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.5,
        });

        const handleLenisScroll = (): void => {
            ScrollTrigger.update();
        };

        lenis.on('scroll', handleLenisScroll);

        const tickerCallback = (time: number): void => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        const removeNavigateListener = router.on('navigate', () => {
            lenis.scrollTo(0, { immediate: true });
            window.requestAnimationFrame(() => {
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

        return () => {
            removeNavigateListener();
            reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
            lenis.off('scroll', handleLenisScroll);
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
