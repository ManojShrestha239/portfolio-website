import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '@/motion/MagneticButton';
import { Button } from '@/components/ui/button';
import type { ProjectItem } from '@/types/portfolio';

gsap.registerPlugin(ScrollTrigger);

interface FlagshipShowcaseSectionProps {
    readonly projects: readonly ProjectItem[];
}

export function FlagshipShowcaseSection({ projects }: FlagshipShowcaseSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) {
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            return;
        }

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('[data-flagship-card]');

            cards.forEach((card) => {
                const progressBar = card.querySelector<HTMLElement>('[data-scrub-bar]');
                const metricPanel = card.querySelector<HTMLElement>('[data-scrub-panel]');

                if (progressBar) {
                    gsap.fromTo(
                        progressBar,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            transformOrigin: 'left center',
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 78%',
                                end: 'bottom 45%',
                                scrub: 0.8,
                            },
                        },
                    );
                }

                if (metricPanel) {
                    gsap.fromTo(
                        metricPanel,
                        { y: 28, opacity: 0.65 },
                        {
                            y: 0,
                            opacity: 1,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 82%',
                                end: 'top 32%',
                                scrub: 0.8,
                            },
                        },
                    );
                }
            });
        }, section);

        return () => ctx.revert();
    }, [projects]);

    return (
        <section
            id="flagship"
            ref={sectionRef}
            className="mx-auto max-w-[1380px] px-6 py-24 lg:px-10"
        >
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
                <div>
                    <p className="telemetry-label text-accent">
                        01 · Flagship Architecture Showcases
                    </p>
                    <h2 className="editorial-display mt-3 text-[clamp(2.4rem,5vw,4.4rem)] font-normal text-ink">
                        Production Systems Built for Scale &amp; Precision.
                    </h2>
                </div>
                <p className="max-w-[40ch] text-sm text-ink-secondary">
                    Scroll-linked architectural dossiers detailing hardware-to-web dispensing,
                    database-per-tenant SaaS evolution, deterministic calendars, and zero-trust
                    licensing.
                </p>
            </div>

            <div className="space-y-10">
                {projects.map((project, idx) => (
                    <article
                        key={project.id}
                        data-flagship-card
                        className="relative overflow-hidden border border-hairline bg-surface/95"
                    >
                        <div
                            data-scrub-bar
                            aria-hidden="true"
                            className="h-0.5 w-full bg-accent"
                        />

                        <div className="grid grid-cols-1 gap-8 p-7 lg:grid-cols-12 lg:p-10">
                            <div className="flex flex-col justify-between gap-6 lg:col-span-7">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-mono text-xs text-accent">
                                            CASE {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="h-px w-6 bg-hairline" aria-hidden="true" />
                                        <span className="telemetry-label text-ink-muted">
                                            {project.category}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 font-grotesk text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                                        {project.title}
                                    </h3>

                                    <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        {project.summary}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-xs border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-secondary"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div>
                                        <MagneticButton>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/work/${project.slug}`}>
                                                    <span>Read Architecture Dossier</span>
                                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                </Link>
                                            </Button>
                                        </MagneticButton>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-scrub-panel
                                className="flex flex-col justify-between border-t border-hairline pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
                            >
                                <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline">
                                    {project.metrics.slice(0, 4).map((metric) => (
                                        <div key={metric.label} className="bg-canvas p-5">
                                            <p className="font-grotesk text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                                                {metric.value}
                                            </p>
                                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
                                                {metric.label}
                                            </p>
                                            {metric.unit && (
                                                <p className="mt-1 font-mono text-[10px] text-accent">
                                                    {metric.unit}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {project.previewImagePath && (
                                    <div className="mt-5 overflow-hidden border border-hairline">
                                        <img
                                            src={`/storage/${project.previewImagePath}`}
                                            alt={project.title}
                                            loading="lazy"
                                            className="h-44 w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
