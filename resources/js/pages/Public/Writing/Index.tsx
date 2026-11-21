import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import { cn } from '@/lib/utils';
import type { ArticleItem, SharedPageProps } from '@/types/portfolio';

interface WritingIndexProps extends SharedPageProps {
    readonly articles: readonly ArticleItem[];
    readonly availableTags: readonly string[];
    readonly activeTag: string | null;
    readonly totalCount: number;
    readonly canonicalUrl: string;
}

function WritingIndex({
    articles,
    availableTags,
    activeTag,
    totalCount,
    canonicalUrl,
}: WritingIndexProps) {
    return (
        <>
            <SeoHead
                title="Engineering Research & Technical Writing"
                description="Deep-dive engineering essays on Laravel multi-tenancy, RS-232 industrial automation, streaming ETL, zero-trust HMAC licensing, and OWASP hardening."
                url={canonicalUrl}
            />

            <section className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-24">
                <header className="border-b border-hairline pb-10">
                    <p className="telemetry-label text-accent">
                        Technical Monograph · {totalCount} Published Essays
                    </p>
                    <h1 className="editorial-display mt-3 text-[clamp(2.6rem,6vw,5.2rem)] font-normal text-ink">
                        Engineering Research &amp; Writing.
                    </h1>
                    <p className="mt-5 max-w-[58ch] text-base text-ink-secondary">
                        Architecture notes distilled from production Laravel multi-tenant platforms,
                        industrial dispenser protocols, high-throughput Excel pipelines, and legacy
                        PHP security remediations.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <Link
                            href="/writing"
                            className={cn(
                                'rounded-xs border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
                                activeTag === null
                                    ? 'border-accent bg-accent text-canvas'
                                    : 'border-hairline bg-surface text-ink-secondary hover:text-ink',
                            )}
                        >
                            All ({totalCount})
                        </Link>
                        {availableTags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/writing?tag=${encodeURIComponent(tag)}`}
                                className={cn(
                                    'rounded-xs border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
                                    activeTag === tag
                                        ? 'border-accent bg-accent text-canvas'
                                        : 'border-hairline bg-surface text-ink-secondary hover:text-ink',
                                )}
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </header>

                <div className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2">
                    {articles.map((article, idx) => (
                        <article
                            key={article.id}
                            className="group flex flex-col justify-between gap-6 bg-surface p-8 transition-colors hover:bg-surface-hover"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-mono text-xs text-accent">
                                        {String(idx + 1).padStart(2, '0')} · {article.targetAudience}
                                    </span>
                                    <span className="font-mono text-[11px] uppercase text-ink-muted">
                                        {article.readingTimeMins} min
                                    </span>
                                </div>

                                <h2 className="mt-4 font-grotesk text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent">
                                    <Link href={`/writing/${article.slug}`}>{article.title}</Link>
                                </h2>

                                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                    {article.excerpt}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-xs border border-hairline bg-canvas px-2 py-0.5 font-mono text-[10px] uppercase text-ink-secondary"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={`/writing/${article.slug}`}
                                    className="inline-flex items-center gap-1 font-mono text-xs uppercase text-ink hover:text-accent"
                                >
                                    <span>Read Essay</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

WritingIndex.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default WritingIndex;
