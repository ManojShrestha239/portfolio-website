import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { MetricStrip } from '@/components/domain/MetricStrip';
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
}: HomePageProps) {
    const { openDrawer } = useScopeDrawer();
    return (
        <>
            <Head title="Enterprise SaaS & Industrial Automation Architect" />

            {/* 1. Editorial Hero & Live Telemetry Index */}
            <section className="mx-auto max-w-[1380px] px-6 pb-20 pt-20 lg:px-10 lg:pt-28">
                <div className="grid grid-cols-1 gap-10 border-b border-hairline pb-16 lg:grid-cols-12">
                    <div className="lg:col-span-9">
                        <p className="telemetry-label mb-6 flex items-center gap-3 text-ink-secondary">
                            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
                            <span>{siteSettings.availabilityStatus}</span>
                        </p>

                        <h1 className="editorial-display text-[clamp(3.2rem,8vw,7.5rem)] font-normal text-ink">
                            {siteSettings.heroHeadline}
                        </h1>
                    </div>

                    <div className="flex flex-col justify-end gap-6 lg:col-span-3">
                        <p className="max-w-[34ch] text-sm leading-relaxed text-ink-secondary">
                            {siteSettings.heroSubheadline}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <MagneticButton>
                                <Button variant="accent" size="default" asChild>
                                    <a href="#flagship">
                                        <span>Inspect Systems</span>
                                        <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                </Button>
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                <MetricStrip metrics={telemetry} />
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
