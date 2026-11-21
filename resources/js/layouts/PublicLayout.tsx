import { type PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { DitheredFieldCanvas } from '@/webgl/DitheredFieldCanvas';
import { SmoothScrollProvider } from '@/motion/SmoothScrollProvider';
import { Button } from '@/components/ui/button';
import type { SharedPageProps } from '@/types/portfolio';

export function PublicLayout({ children }: PropsWithChildren) {
    const page = usePage<SharedPageProps>();
    const prefersReducedMotion = useReducedMotion();
    const { app } = page.props;

    return (
        <div className="relative min-h-screen bg-canvas text-ink">
            {/* Persistent WebGL Raymarched + 8x8 Bayer Dithered + Film Grain Canvas */}
            <DitheredFieldCanvas />

            <SmoothScrollProvider>
                <div className="relative z-10 flex min-h-screen flex-col">
                    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90">
                        <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between px-6 lg:px-10">
                            <Link
                                href="/"
                                className="group flex items-center gap-3 focus-visible:outline-accent"
                            >
                                <span className="h-2 w-2 rounded-xs bg-accent" aria-hidden="true" />
                                <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink">
                                    {app.owner}
                                </span>
                                <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted sm:inline">
                                    / Systems &amp; SaaS
                                </span>
                            </Link>

                            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
                                <Link
                                    href="/"
                                    className="telemetry-label text-ink-secondary transition-colors hover:text-ink"
                                >
                                    Index
                                </Link>
                                <a
                                    href="#telemetry"
                                    className="telemetry-label text-ink-secondary transition-colors hover:text-ink"
                                >
                                    Telemetry
                                </a>
                                <a
                                    href="#capabilities"
                                    className="telemetry-label text-ink-secondary transition-colors hover:text-ink"
                                >
                                    Architecture
                                </a>
                            </nav>

                            <div className="flex items-center gap-3">
                                <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted lg:inline-flex">
                                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                                    {app.location}
                                </span>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="#scope-anchor">
                                        <span>Scope Project</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={page.url}
                                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                                transition={{
                                    duration: prefersReducedMotion ? 0.12 : 0.32,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    <footer className="border-t border-hairline bg-canvas/95">
                        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                            <div className="space-y-1">
                                <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                                    {app.owner}
                                </p>
                                <p className="text-xs text-ink-muted">
                                    {app.role}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                                <span>Laravel 13 · React 19 · WebGL Bayer 8×8</span>
                                <span>&copy; {new Date().getFullYear()}</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </SmoothScrollProvider>
        </div>
    );
}
