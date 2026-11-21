import type { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function PageTransition({ children }: PropsWithChildren) {
    const page = usePage();
    const prefersReducedMotion = useReducedMotion();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={page.url}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{
                    duration: prefersReducedMotion ? 0.12 : 0.34,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
