import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface KineticMarqueeTextProps {
    readonly text: string;
    readonly direction?: 'left' | 'right';
    readonly className?: string;
}

export function KineticMarqueeText({
    text,
    direction = 'left',
    className,
}: KineticMarqueeTextProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) {
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            return;
        }

        const ctx = gsap.context(() => {
            const fromX = direction === 'left' ? '2%' : '-16%';
            const toX = direction === 'left' ? '-16%' : '2%';

            gsap.fromTo(
                track,
                { x: fromX },
                {
                    x: toX,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                },
            );
        }, container);

        return () => ctx.revert();
    }, [direction]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                'overflow-hidden border-y border-hairline bg-canvas/85 py-6 select-none',
                className,
            )}
        >
            <div
                ref={trackRef}
                className="editorial-display whitespace-nowrap text-[clamp(2.8rem,7vw,6.4rem)] font-normal text-ink/90 will-change-transform"
            >
                <span>{text}</span>
                <span className="text-accent">{text}</span>
            </div>
        </div>
    );
}
