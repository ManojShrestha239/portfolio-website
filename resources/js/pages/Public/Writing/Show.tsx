import { useMemo, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import type { ArticleItem, SharedPageProps } from '@/types/portfolio';

interface ArticleShowProps extends SharedPageProps {
    readonly article: ArticleItem;
    readonly relatedArticles: readonly ArticleItem[];
    readonly canonicalUrl: string;
}

interface TocHeading {
    readonly id: string;
    readonly text: string;
    readonly level: 2 | 3;
}

function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function injectHeadingIds(html: string): {
    readonly enrichedHtml: string;
    readonly headings: readonly TocHeading[];
} {
    const headings: TocHeading[] = [];
    const enrichedHtml = html.replace(
        /<h([23])>(.*?)<\/h\1>/g,
        (_match, levelStr: string, innerHtml: string) => {
            const plainText = innerHtml.replace(/<[^>]+>/g, '').trim();
            const id = slugifyHeading(plainText) || `section-${headings.length + 1}`;
            const level = levelStr === '3' ? 3 : 2;
            headings.push({ id, text: plainText, level });
            return `<h${level} id="${id}">${innerHtml}</h${level}>`;
        },
    );

    return { enrichedHtml, headings };
}

function ArticleShow({ article, relatedArticles, canonicalUrl, app }: ArticleShowProps) {
    const { enrichedHtml, headings } = useMemo(
        () => injectHeadingIds(article.bodyHtml),
        [article.bodyHtml],
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: article.title,
        description: article.excerpt,
        author: {
            '@type': 'Person',
            name: app.owner,
        },
        datePublished: article.publishedAt,
        keywords: article.tags.join(', '),
        url: canonicalUrl,
    };

    return (
        <>
            <SeoHead
                title={article.title}
                description={article.excerpt}
                url={canonicalUrl}
                type="article"
                jsonLd={jsonLd}
            />

            <article className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-24">
                <div className="mb-10 flex items-center justify-between border-b border-hairline pb-5">
                    <Link
                        href="/writing"
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-secondary transition-colors hover:text-ink"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>All Technical Writing</span>
                    </Link>
                    <span className="telemetry-label text-accent">
                        {article.readingTimeMins} min read
                    </span>
                </div>

                <header className="border-b border-hairline pb-12">
                    <p className="telemetry-label text-ink-muted">
                        Audience · {article.targetAudience}
                    </p>
                    <h1 className="editorial-display mt-4 max-w-[22ch] text-[clamp(2.4rem,5.5vw,4.8rem)] font-normal text-ink">
                        {article.title}
                    </h1>
                    <p className="mt-6 max-w-[66ch] text-base leading-relaxed text-ink-secondary">
                        {article.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/writing?tag=${encodeURIComponent(tag)}`}
                                className="rounded-xs border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-secondary transition-colors hover:border-accent hover:text-accent"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </header>

                <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div
                            className="editorial-prose"
                            dangerouslySetInnerHTML={{ __html: enrichedHtml }}
                        />
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 border border-hairline bg-surface p-6">
                            <p className="telemetry-label border-b border-hairline pb-3 text-accent">
                                Table of Contents
                            </p>
                            {headings.length === 0 ? (
                                <p className="mt-4 text-xs text-ink-muted">
                                    Single-section technical note.
                                </p>
                            ) : (
                                <nav aria-label="Table of Contents" className="mt-4 space-y-2.5">
                                    {headings.map((heading) => (
                                        <a
                                            key={heading.id}
                                            href={`#${heading.id}`}
                                            className={`block font-mono text-xs text-ink-secondary transition-colors hover:text-accent ${
                                                heading.level === 3 ? 'pl-4 text-[11px]' : ''
                                            }`}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </aside>
                </div>

                {relatedArticles.length > 0 && (
                    <section className="mt-20 border-t border-hairline pt-12">
                        <p className="telemetry-label mb-6 text-accent">More Engineering Essays</p>
                        <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
                            {relatedArticles.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/writing/${item.slug}`}
                                    className="group flex flex-col justify-between gap-4 bg-surface p-6 transition-colors hover:bg-surface-hover"
                                >
                                    <div>
                                        <p className="font-mono text-[10px] uppercase text-ink-muted">
                                            {item.readingTimeMins} min read
                                        </p>
                                        <h2 className="mt-2 font-grotesk text-lg font-medium text-ink group-hover:text-accent">
                                            {item.title}
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-1 font-mono text-xs uppercase text-ink-secondary group-hover:text-accent">
                                        <span>Read</span>
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

ArticleShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default ArticleShow;
