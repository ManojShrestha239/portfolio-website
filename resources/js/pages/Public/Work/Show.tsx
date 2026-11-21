import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import { MermaidDiagram } from '@/components/domain/MermaidDiagram';
import type { ProjectItem, SharedPageProps } from '@/types/portfolio';

interface WorkShowProps extends SharedPageProps {
    readonly project: ProjectItem;
    readonly relatedProjects: readonly ProjectItem[];
    readonly canonicalUrl: string;
}

function WorkShow({ project, relatedProjects, canonicalUrl, app }: WorkShowProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: project.title,
        description: project.summary,
        author: {
            '@type': 'Person',
            name: app.owner,
        },
        url: canonicalUrl,
        datePublished: project.publishedAt,
    };

    return (
        <>
            <SeoHead
                title={project.title}
                description={project.summary}
                url={canonicalUrl}
                type="article"
                jsonLd={jsonLd}
            />

            <article className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-24">
                <div className="mb-10 flex items-center justify-between border-b border-hairline pb-5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-secondary transition-colors hover:text-ink"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Back to Index</span>
                    </Link>
                    <span className="telemetry-label text-accent">
                        {project.isFlagship ? 'Flagship Architecture' : 'Production System'}
                    </span>
                </div>

                <header className="grid grid-cols-1 gap-8 border-b border-hairline pb-12 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <p className="telemetry-label text-ink-muted">{project.category}</p>
                        <h1 className="editorial-display mt-3 text-[clamp(2.5rem,5.5vw,4.8rem)] font-normal text-ink">
                            {project.title}
                        </h1>
                        <p className="mt-6 max-w-[64ch] text-base leading-relaxed text-ink-secondary">
                            {project.summary}
                        </p>
                    </div>

                    <div className="flex flex-col justify-end lg:col-span-4">
                        <p className="telemetry-label mb-3 text-ink-muted">Technology Stack</p>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-xs border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-secondary"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                <section className="my-12 grid grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-4">
                    {project.metrics.map((metric) => (
                        <div key={metric.label} className="bg-surface p-6">
                            <p className="font-grotesk text-3xl font-semibold text-ink sm:text-4xl">
                                {metric.value}
                            </p>
                            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                                {metric.label}
                            </p>
                            {metric.unit && (
                                <p className="mt-1 font-mono text-[11px] text-accent">
                                    {metric.unit}
                                </p>
                            )}
                        </div>
                    ))}
                </section>

                {project.diagramMermaid && (
                    <section className="my-12">
                        <MermaidDiagram
                            definition={project.diagramMermaid}
                            title={`${project.title} — System Flow`}
                        />
                    </section>
                )}

                {project.previewImagePath && (
                    <section className="my-12 overflow-hidden border border-hairline bg-surface">
                        <img
                            src={`/storage/${project.previewImagePath}`}
                            alt={project.title}
                            className="max-h-[540px] w-full object-cover"
                        />
                    </section>
                )}

                <section
                    className="editorial-prose my-14"
                    dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
                />

                {relatedProjects.length > 0 && (
                    <section className="mt-20 border-t border-hairline pt-12">
                        <p className="telemetry-label mb-6 text-accent">Related Architectures</p>
                        <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
                            {relatedProjects.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/work/${item.slug}`}
                                    className="group flex flex-col justify-between gap-4 bg-surface p-6 transition-colors hover:bg-surface-hover"
                                >
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
                                            {item.category}
                                        </p>
                                        <h2 className="mt-2 font-grotesk text-lg font-medium text-ink group-hover:text-accent">
                                            {item.title}
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-1 font-mono text-xs uppercase text-ink-secondary group-hover:text-accent">
                                        <span>Inspect</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}

WorkShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default WorkShow;
