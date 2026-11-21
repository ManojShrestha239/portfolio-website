import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { DitheredFieldCanvas } from '@/webgl/DitheredFieldCanvas';
import { SmoothScrollProvider, useSmoothScroll } from '@/motion/SmoothScrollProvider';
import { PageTransition } from '@/motion/PageTransition';
import { MagneticButton } from '@/motion/MagneticButton';
import { ScopeDrawerProvider, useScopeDrawer } from '@/context/ScopeDrawerContext';
import { FieldConsoleProvider } from '@/context/FieldConsoleContext';
import { ScopeDrawer } from '@/components/domain/ScopeDrawer';
import { EditorialFooter } from '@/components/domain/EditorialFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/portfolio';

type NavKey = 'overview' | 'capability' | 'systems' | 'writing' | 'resume' | 'contact';

interface NavEntry {
    readonly key: NavKey;
    readonly label: string;
    readonly href: string;
    readonly isAnchor?: boolean;
}

const NAV_ENTRIES: readonly NavEntry[] = [
    { key: 'overview', label: 'Overview', href: '/' },
    { key: 'capability', label: 'Capability', href: '/#flagship', isAnchor: true },
    { key: 'systems', label: 'Systems', href: '/#systems-index', isAnchor: true },
    { key: 'writing', label: 'Writing', href: '/writing' },
    { key: 'resume', label: 'Resume', href: '/resume' },
    { key: 'contact', label: 'Contact', href: '/contact' },
];

function resolveRouteNavKey(url: string): NavKey {
    const pathname = url.split('?')[0] ?? '/';
    if (pathname.startsWith('/writing')) {
        return 'writing';
    }
    if (pathname.startsWith('/resume')) {
        return 'resume';
    }
    if (pathname.startsWith('/contact')) {
        return 'contact';
    }
    if (pathname.startsWith('/work')) {
        return 'capability';
    }
    return 'overview';
}

function PublicLayoutInner({ children }: PropsWithChildren) {
    const page = usePage<SharedPageProps>();
    const { openDrawer } = useScopeDrawer();
    const { subscribeProgress, scrollTo } = useSmoothScroll();
    const { app } = page.props;

    const pathname = page.url.split('?')[0] ?? '/';
    const isHome = pathname === '/';

    const [activeSection, setActiveSection] = useState<NavKey>(() =>
        resolveRouteNavKey(page.url),
    );

    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const progressTrackRef = useRef<HTMLDivElement | null>(null);
    const percentLabelRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        setActiveSection(resolveRouteNavKey(page.url));
    }, [page.url]);

    useEffect(() => {
        const removeStart = router.on('start', () => {
            delete document.documentElement.dataset.band;
        });

        return () => {
            removeStart();
            delete document.documentElement.dataset.band;
        };
    }, []);

    // Track home sections on scroll so Overview / Capability / Systems highlight accurately
    useEffect(() => {
        if (!isHome) {
            return;
        }

        const sections: readonly { readonly id: string; readonly key: NavKey }[] = [
            { id: 'overview', key: 'overview' },
            { id: 'flagship', key: 'capability' },
            { id: 'systems-index', key: 'systems' },
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const matched = sections.find((s) => s.id === entry.target.id);
                        if (matched) {
                            setActiveSection(matched.key);
                        }
                    }
                }
            },
            { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
        );

        for (const section of sections) {
            const el = document.getElementById(section.id);
            if (el) {
                observer.observe(el);
            }
        }

        return () => observer.disconnect();
    }, [isHome, page.url]);

    // Zero-React-rerender 144Hz scroll progress updates via direct DOM refs
    useEffect(() => {
        let lastRounded = -1;

        const unsubscribe = subscribeProgress((progress) => {
            if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scale3d(${progress}, 1, 1)`;
            }
            const rounded = Math.round(progress * 100);
            if (rounded !== lastRounded) {
                lastRounded = rounded;
                if (percentLabelRef.current) {
                    percentLabelRef.current.textContent = `${String(rounded).padStart(2, '0')}%`;
                }
                if (progressTrackRef.current) {
                    progressTrackRef.current.setAttribute('aria-valuenow', String(rounded));
                }
            }
        });

        return unsubscribe;
    }, [subscribeProgress]);

    return (
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
                        {NAV_ENTRIES.map((item) => {
                            const isActive = activeSection === item.key;
                            const navClasses = cn(
                                'group relative py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors duration-200',
                                isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                            );

                            const underline = (
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-accent transition-transform duration-300 ease-out',
                                        isActive
                                            ? 'scale-x-100'
                                            : 'scale-x-0 group-hover:scale-x-100',
                                    )}
                                />
                            );

                            if (item.isAnchor && isHome) {
                                const hash = item.href.replace('/', '');
                                return (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollTo(hash);
                                        }}
                                        className={navClasses}
                                    >
                                        <span>{item.label}</span>
                                        {underline}
                                    </a>
                                );
                            }

                            if (item.isAnchor) {
                                return (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={navClasses}
                                    >
                                        <span>{item.label}</span>
                                        {underline}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={navClasses}
                                >
                                    <span>{item.label}</span>
                                    {underline}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-ink-muted sm:inline-flex">
                            <span ref={percentLabelRef} className="text-accent">
                                00%
                            </span>
                        </span>

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

                {/* 144Hz GPU-composited scroll progress bar directly below nav */}
                <div
                    ref={progressTrackRef}
                    role="progressbar"
                    aria-label="Page scroll progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={0}
                    className="relative h-[2px] w-full overflow-hidden bg-hairline/70"
                >
                    <div
                        ref={progressBarRef}
                        style={{ transform: 'scale3d(0, 1, 1)' }}
                        className="h-full w-full origin-left bg-accent will-change-transform"
                    />
                </div>
            </header>

            <main className="flex-1">
                <PageTransition>{children}</PageTransition>
            </main>

            <EditorialFooter />
        </div>
    );
}

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <FieldConsoleProvider>
            <ScopeDrawerProvider>
                <div className="relative min-h-screen bg-canvas text-ink">
                    {/* Persistent WebGL Raymarched + 8x8 Bayer Dithered + Film Grain Canvas */}
                    <DitheredFieldCanvas />

                    {/* Subtle 96px architectural hairline grid promoted to its own compositor layer */}
                    <div
                        aria-hidden="true"
                        className="architectural-grid-layer pointer-events-none fixed inset-0 z-[1] opacity-55 [transform:translateZ(0)]"
                    />

                    <SmoothScrollProvider>
                        <PublicLayoutInner>{children}</PublicLayoutInner>
                    </SmoothScrollProvider>

                    <ScopeDrawer />
                </div>
            </ScopeDrawerProvider>
        </FieldConsoleProvider>
    );
}
