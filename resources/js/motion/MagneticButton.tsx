import { useEffect, useRef, useState, type MouseEvent, type PropsWithChildren } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends PropsWithChildren {
    readonly className?: string;
    readonly maxOffset?: number;
}

export function MagneticButton({
    children,
    className,
    maxOffset = 8,
}: MagneticButtonProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const [canHoverFine, setCanHoverFine] = useState<boolean>(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

    const springX = useSpring(rawX, { stiffness: 260, damping: 20, mass: 0.5 });
    const springY = useSpring(rawY, { stiffness: 260, damping: 20, mass: 0.5 });

    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = (): void => setCanHoverFine(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const enabled = canHoverFine && !prefersReducedMotion;

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
        if (!enabled || !wrapperRef.current) {
            return;
        }
        const rect = wrapperRef.current.getBoundingClientRect();
        const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        const clampedX = Math.max(-1, Math.min(1, relX)) * maxOffset;
        const clampedY = Math.max(-1, Math.min(1, relY)) * maxOffset;

        rawX.set(clampedX);
        rawY.set(clampedY);
    };

    const handleMouseLeave = (): void => {
        rawX.set(0);
        rawY.set(0);
    };

    return (
        <motion.div
            ref={wrapperRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={enabled ? { x: springX, y: springY } : undefined}
            className={cn('inline-block', className)}
        >
            {children}
        </motion.div>
    );
}
