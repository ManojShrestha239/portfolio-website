import { useEffect, type PropsWithChildren } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { DitheredFieldCanvas } from '@/webgl/DitheredFieldCanvas';
import { SmoothScrollProvider } from '@/motion/SmoothScrollProvider';
import { PageTransition } from '@/motion/PageTransition';
import { MagneticButton } from '@/motion/MagneticButton';
import { ScopeDrawerProvider, useScopeDrawer } from '@/context/ScopeDrawerContext';
import { FieldConsoleProvider } from '@/context/FieldConsoleContext';
import { ScopeDrawer } from '@/components/domain/ScopeDrawer';
import { EditorialFooter } from '@/components/domain/EditorialFooter';
import { Button } from '@/components/ui/button';
import type { SharedPageProps } from '@/types/portfolio';

function PublicLayoutShell({ children }: PropsWithChildren) {
    const page = usePage<SharedPageProps>();
    const { openDrawer } = useScopeDrawer();
    const { app } = page.props;

    useEffect(() => {
        const removeListener = router.on('start', () => {
            delete document.documentElement.dataset.band;
        });

        return () => {
            removeListener();
            delete document.documentElement.dataset.band;
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-canvas text-ink">
            {/* Persistent WebGL Raymarched + 8x8 Bayer Dithered + Film Grain Canvas */}
            <DitheredFieldCanvas />

            {/* Subtle 96px architectural hairline grid */}
            <div
                aria-hidden="true"
                className="architectural-grid-layer pointer-events-none fixed inset-0 z-[1] opacity-55"
            />

            <SmoothScrollProvider>
                <div className="relative z-10 flex min-h-screen flex-col">
                    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/94 transition-colors duration-500">
                        <div className="mx-auto flex h-[4.25rem] max-w-[1680px] items-center justify-between px-5 lg:px-8">
                            <Link
                                href="/"
                                className="group flex items-center gap-3 focus-visible:outline-accent"
                            >
                                <span className="flex h-8 w-8 items-center justify-center border border-accent font-mono text-[11px] text-accent transition-colors group-hover:bg-accent group-hover:text-canvas">
                                    MS
                                </span>
                                <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-secondary transition-colors group-hover:text-ink">
                                    {app.owner}
                                </span>
                            </Link>

                            <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
                                <Link
                                    href="/"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Overview
                                </Link>
                                <a
                                    href="/#flagship"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Capability
                                </a>
                                <a
                                    href="/#systems-index"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Systems
                                </a>
                                <Link
                                    href="/writing"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Writing
                                </Link>
                                <Link
                                    href="/resume"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Resume
                                </Link>
                                <Link
                                    href="/contact"
                                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink"
                                >
                                    Contact
                                </Link>
                            </nav>

                            <div className="flex items-center gap-3">
                                <MagneticButton>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDrawer()}
                                    >
                                        <span>Scope Project</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Button>
                                </MagneticButton>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">
                        <PageTransition>{children}</PageTransition>
                    </main>

                    <EditorialFooter />
                </div>
            </SmoothScrollProvider>

            <ScopeDrawer />
        </div>
    );
}

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <FieldConsoleProvider>
            <ScopeDrawerProvider>
                <PublicLayoutShell>{children}</PublicLayoutShell>
            </ScopeDrawerProvider>
        </FieldConsoleProvider>
    );
}
