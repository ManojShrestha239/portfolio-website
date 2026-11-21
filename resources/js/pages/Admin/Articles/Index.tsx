import type { ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type { ArticleItem, SharedPageProps } from '@/types/portfolio';

interface ArticlesIndexProps extends SharedPageProps {
    readonly articles: readonly ArticleItem[];
}

function AdminArticlesIndex({ articles }: ArticlesIndexProps) {
    const handleDelete = (article: ArticleItem): void => {
        if (!window.confirm(`Delete "${article.title}"? This immediately updates the live site.`)) {
            return;
        }
        router.delete(`/admin/articles/${article.id}`);
    };

    return (
        <>
            <Head title="Articles CMS" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Research &amp; Writing</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        Technical Articles ({articles.length})
                    </h1>
                </div>

                <Button variant="accent" size="sm" asChild>
                    <Link href="/admin/articles/create">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Write Article</span>
                    </Link>
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto border border-hairline bg-surface">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-hairline bg-canvas/60 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                            <th className="px-4 py-3">Article</th>
                            <th className="px-4 py-3">Tags</th>
                            <th className="px-4 py-3">Read Time</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-surface-hover">
                                <td className="px-4 py-3.5">
                                    <p className="font-medium text-ink">{article.title}</p>
                                    <p className="font-mono text-xs text-ink-muted">
                                        /writing/{article.slug}
                                    </p>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex flex-wrap gap-1.5">
                                        {article.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-xs border border-hairline bg-canvas px-2 py-0.5 font-mono text-[10px] uppercase text-ink-secondary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-xs text-ink-secondary">
                                    {article.readingTimeMins} min
                                </td>
                                <td className="px-4 py-3.5">
                                    <span
                                        className={
                                            article.publishedAt
                                                ? 'font-mono text-xs text-success'
                                                : 'font-mono text-xs text-ink-muted'
                                        }
                                    >
                                        {article.publishedAt ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/articles/${article.id}/edit`}>
                                                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                                                <span>Edit</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(article)}
                                            aria-label={`Delete ${article.title}`}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

AdminArticlesIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminArticlesIndex;
