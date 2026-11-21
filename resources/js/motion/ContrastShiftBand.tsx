import { useEffect, useRef, type PropsWithChildren } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ContrastShiftBandProps extends PropsWithChildren {
    readonly id?: string;
    readonly className?: string;
}

export function ContrastShiftBand({ id, className, children }: ContrastShiftBandProps) {
    const bandRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const band = bandRef.current;
        if (!band) {
            return;
        }

        const activateArchival = (): void => {
            document.documentElement.dataset.band = 'archival';
        };

        const restoreObsidian = (): void => {
            delete document.documentElement.dataset.band;
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: band,
                start: 'top 52%',
                end: 'bottom 48%',
                onEnter: activateArchival,
                onEnterBack: activateArchival,
                onLeave: restoreObsidian,
                onLeaveBack: restoreObsidian,
            });
        }, band);

        return () => {
            ctx.revert();
            restoreObsidian();
        };
    }, []);

    return (
        <section
            id={id}
            ref={bandRef}
            data-band="archival"
            className={cn(
                'relative z-20 border-y border-hairline bg-canvas text-ink transition-colors duration-500',
                className,
            )}
        >
            {children}
        </section>
    );
}
