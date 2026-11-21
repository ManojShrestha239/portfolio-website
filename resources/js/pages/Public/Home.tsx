import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import { Button } from '@/components/ui/button';
import { FieldConsole } from '@/components/domain/FieldConsole';
import { FlagshipShowcaseSection } from '@/components/domain/FlagshipShowcaseSection';
import { KineticMarqueeText } from '@/motion/KineticMarqueeText';
import { ContrastShiftBand } from '@/motion/ContrastShiftBand';
import { HoverRevealRow } from '@/motion/HoverRevealRow';
import { MagneticButton } from '@/motion/MagneticButton';
import { useScopeDrawer } from '@/context/ScopeDrawerContext';
import type { HomePageProps } from '@/types/portfolio';

function Home({
    siteSettings,
    telemetry,
    flagshipProjects,
    secondaryProjects,
    recentArticles,
    app,
}: HomePageProps) {
    const { openDrawer } = useScopeDrawer();
    const heroRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) {
            return;
        }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('[data-hero="0"]', { opacity: 0, y: 18, duration: 0.7 }, 0.08)
                .from(
                    '[data-hero-line]',
                    {
                        yPercent: 110,
                        duration: 0.9,
                        stagger: 0.12,
                        ease: 'power4.out',
                    },
                    0.12,
                )
                .from('[data-hero="1"]', { opacity: 0, y: 18, duration: 0.7 }, 0.48)
                .from('[data-hero="2"]', { opacity: 0, y: 18, duration: 0.7 }, 0.6)
                .from('[data-hero="3"]', { opacity: 0, x: 24, duration: 0.8 }, 0.52)
                .from(
                    '[data-hero="4"] > div',
                    { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 },
                    0.78,
                );
        }, hero);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <SeoHead
                title="Senior Full-Stack Engineer · Enterprise SaaS & Industrial Automation"
                description={siteSettings.heroSubheadline}
            />

            {/* 1. Monumental Hero + Live WebGL Field Console + 4-Column Hairline Ledger */}
            <section
                id="overview"
                ref={heroRef}
                className="flex min-h-[calc(100svh-4.25rem)] flex-col justify-between px-5 pb-8 pt-10 lg:px-8 lg:pt-14"
            >
                <div className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div
                            data-hero="0"
                            className="flex flex-wrap items-center gap-x-4 gap-y-2"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                                Portfolio · Edition 01
                            </span>
                            <span className="h-px w-10 bg-hairline" aria-hidden="true" />
                            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-muted">
                                {app.location}
                            </span>
                        </div>

                        <h1 className="display-monumental mt-7 text-[clamp(3.4rem,11.5vw,10.8rem)] text-ink">
                            <span className="block overflow-hidden">
                                <span data-hero-line className="block">
                                    Manoj
                                </span>
                            </span>
                            <span className="block overflow-hidden">
                                <span data-hero-line className="outline-txt block">
                                    Shrestha
                                </span>
                            </span>
                        </h1>

                        <div
                            data-hero="1"
                            className="mt-8 max-w-[62ch] border-l border-accent pl-5"
                        >
                            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                                Senior Full-Stack Software Engineer
                            </div>
                            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                                Enterprise SaaS &amp; Industrial Automation Architect
                            </div>
                            <p className="mt-5 text-[15px] leading-[1.7] text-ink-secondary">
                                {siteSettings.heroSubheadline}
                            </p>
                        </div>

                        <div
                            data-hero="2"
                            className="mt-9 flex flex-wrap items-center gap-3"
                        >
                            <MagneticButton>
                                <Button variant="accent" size="lg" asChild>
                                    <a href="#flagship">
                                        <span>Inspect capability</span>
                                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                </Button>
                            </MagneticButton>

                            <MagneticButton>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => openDrawer()}
                                >
                                    <span>Scope project</span>
                                </Button>
                            </MagneticButton>
                        </div>
                    </div>

                    <div data-hero="3" className="lg:col-span-5 xl:col-span-4">
                        <FieldConsole />
                    </div>
                </div>

                <div
                    id="telemetry"
                    data-hero="4"
                    className="mx-auto mt-12 grid w-full max-w-[1680px] grid-cols-2 gap-px border-t border-hairline bg-hairline lg:grid-cols-4"
                >
                    {telemetry.map((metric) => (
                        <div
                            key={metric.label}
                            className="bg-canvas px-4 py-5 transition-colors duration-500 lg:px-6"
                        >
                            <div className="display-monumental text-[clamp(1.9rem,3.4vw,2.9rem)] text-ink">
                                {metric.value}
                            </div>
                            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-secondary">
                                {metric.label}
                            </div>
                            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                                {metric.unit}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Horizontal Scroll Kinetic Typography Band 1 */}
            <KineticMarqueeText
                text="SYSTEMS ARCHITECTURE · MULTI-TENANT SAAS · INDUSTRIAL AUTOMATION · "
                direction="left"
            />

            {/* 3. Scroll-Scrubbed Flagship Architecture Showcases */}
            <FlagshipShowcaseSection projects={flagshipProjects} />

            {/* 4. Full-Bleed Dark-to-Light Archival Contrast Shift: Research & Writing */}
            <ContrastShiftBand id="writing">
                <div className="mx-auto max-w-[1380px] px-6 py-24 lg:px-10">
                    <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
                        <div>
                            <p className="telemetry-label text-accent">
                                02 · Engineering Research &amp; Technical Writing
                            </p>
                            <h2 className="editorial-display mt-3 text-[clamp(2.4rem,5vw,4.4rem)] font-normal text-ink">
                                Field Notes on Architecture, Protocols &amp; Scale.
                            </h2>
                        </div>
                        <MagneticButton>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/writing">
                                    <span>All 8 Technical Essays</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </Button>
                        </MagneticButton>
                    </div>

                    <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2">
                        {recentArticles.map((article, idx) => (
                            <article
                                key={article.id}
                                className="group flex flex-col justify-between gap-6 bg-canvas p-8 transition-colors hover:bg-surface"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-mono text-xs text-accent">
                                            NOTE {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                                            {article.readingTimeMins} min read
                                        </span>
                                    </div>

                                    <h3 className="mt-4 font-grotesk text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
                                        <Link href={`/writing/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {article.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-xs border border-hairline bg-surface px-2 py-0.5 font-mono text-[10px] uppercase text-ink-secondary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/writing/${article.slug}`}
                                        className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.08em] text-ink hover:text-accent"
                                    >
                                        <span>Read</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </ContrastShiftBand>

            {/* 5. Horizontal Scroll Kinetic Typography Band 2 */}
            <KineticMarqueeText
                text="ZERO-TRUST LICENSING · STREAMING ETL · 5-STAGE QR STATE MACHINES · "
                direction="right"
            />

            {/* 6. Interactive Secondary Systems Index (Hover Marquee + Image-Reveal Rows) */}
            <section id="systems-index" className="mx-auto max-w-[1380px] px-6 py-24 lg:px-10">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
                    <div>
                        <p className="telemetry-label text-accent">
                            03 · Interactive Systems Index
                        </p>
                        <h2 className="editorial-display mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] font-normal text-ink">
                            Additional Production Platforms &amp; Hardening Audits.
                        </h2>
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                        Hover any row to inspect stack &amp; blueprint
                    </p>
                </div>

                <div className="border-t border-hairline">
                    {secondaryProjects.map((project, idx) => (
                        <HoverRevealRow key={project.id} project={project} index={idx} />
                    ))}
                </div>
            </section>

            {/* 7. Magnetic CTA Section */}
            <section id="scope-cta" className="border-t border-hairline bg-surface/90">
                <div className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-8 px-6 py-20 lg:flex-row lg:items-end lg:px-10">
                    <div>
                        <p className="telemetry-label text-accent">04 · Direct Engagement</p>
                        <h2 className="editorial-display mt-3 max-w-[18ch] text-[clamp(2.4rem,5vw,4.5rem)] font-normal text-ink">
                            Architecting a multi-tenant platform or hardware bridge?
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <MagneticButton>
                            <Button
                                type="button"
                                variant="accent"
                                size="lg"
                                onClick={() => openDrawer()}
                            >
                                <span>Initiate Project Scope</span>
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </MagneticButton>
                        <MagneticButton>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/resume">
                                    <span>View Full Resume</span>
                                </Link>
                            </Button>
                        </MagneticButton>
                    </div>
                </div>
            </section>
        </>
    );
}

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Home;
