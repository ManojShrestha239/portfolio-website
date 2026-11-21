import { useMemo, type FormEvent, type ReactNode } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type { ArticleItem, SharedPageProps } from '@/types/portfolio';

interface ArticleFormProps extends SharedPageProps {
    readonly article: ArticleItem | null;
}

function renderLivePreviewBlocks(markdown: string): readonly { kind: 'h2' | 'h3' | 'li' | 'p'; text: string }[] {
    return markdown
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            if (line.startsWith('### ')) {
                return { kind: 'h3' as const, text: line.slice(4) };
            }
            if (line.startsWith('## ')) {
                return { kind: 'h2' as const, text: line.slice(3) };
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return { kind: 'li' as const, text: line.slice(2) };
            }
            return { kind: 'p' as const, text: line };
        });
}

function AdminArticleForm({ article }: ArticleFormProps) {
    const isEditing = article !== null;

    const form = useForm({
        title: article?.title ?? '',
        slug: article?.slug ?? '',
        excerpt: article?.excerpt ?? '',
        target_audience: article?.targetAudience ?? 'Senior Backend & Systems Engineers',
        tags_text: article ? article.tags.join(', ') : '',
        body_markdown: article?.bodyMarkdown ?? '',
        is_published: article ? article.publishedAt !== null : true,
    });

    const estimatedMins = useMemo(() => {
        const words = form.data.body_markdown.trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 220));
    }, [form.data.body_markdown]);

    const previewBlocks = useMemo(
        () => renderLivePreviewBlocks(form.data.body_markdown),
        [form.data.body_markdown],
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const parsedTags = form.data.tags_text
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        form.transform((data) => ({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            target_audience: data.target_audience,
            tags: parsedTags,
            body_markdown: data.body_markdown,
            is_published: data.is_published,
        }));

        if (isEditing) {
            form.put(`/admin/articles/${article.id}`);
        } else {
            form.post('/admin/articles');
        }
    };

    return (
        <>
            <Head title={isEditing ? `Edit ${article.title}` : 'Write Article'} />

            <div className="flex items-center justify-between border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Articles CMS</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        {isEditing ? 'Edit Technical Article' : 'New Technical Article'}
                    </h1>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/articles">&larr; Back to Articles</Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                        <label htmlFor="title" className="telemetry-label mb-2 block text-ink-secondary">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                        />
                        {form.errors.title && <p className="mt-1 font-mono text-xs text-danger">{form.errors.title}</p>}
                    </div>
                    <div>
                        <label htmlFor="slug" className="telemetry-label mb-2 block text-ink-secondary">
                            URL Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            required
                            value={form.data.slug}
                            onChange={(e) => form.setData('slug', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 font-mono text-xs text-ink focus:border-accent focus:outline-none"
                        />
                        {form.errors.slug && <p className="mt-1 font-mono text-xs text-danger">{form.errors.slug}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                        <label htmlFor="target_audience" className="telemetry-label mb-2 block text-ink-secondary">
                            Target Audience
                        </label>
                        <input
                            id="target_audience"
                            type="text"
                            required
                            value={form.data.target_audience}
                            onChange={(e) => form.setData('target_audience', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="tags_text" className="telemetry-label mb-2 block text-ink-secondary">
                            Tags (comma-separated)
                        </label>
                        <input
                            id="tags_text"
                            type="text"
                            required
                            value={form.data.tags_text}
                            onChange={(e) => form.setData('tags_text', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 font-mono text-xs text-ink focus:border-accent focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="excerpt" className="telemetry-label mb-2 block text-ink-secondary">
                        Editorial Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        rows={2}
                        required
                        value={form.data.excerpt}
                        onChange={(e) => form.setData('excerpt', e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border border-hairline bg-surface px-4 py-3">
                    <label className="flex items-center gap-2.5 text-sm text-ink">
                        <input
                            type="checkbox"
                            checked={form.data.is_published}
                            onChange={(e) => form.setData('is_published', e.target.checked)}
                            className="h-4 w-4 accent-accent"
                        />
                        <span>Published (uncheck to save as Draft)</span>
                    </label>
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                        Estimated Reading Time: {estimatedMins} min
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                        <label htmlFor="body_markdown" className="telemetry-label mb-2 block text-ink-secondary">
                            Markdown Source
                        </label>
                        <textarea
                            id="body_markdown"
                            rows={16}
                            required
                            value={form.data.body_markdown}
                            onChange={(e) => form.setData('body_markdown', e.target.value)}
                            className="w-full rounded-xs border border-hairline bg-surface p-4 font-mono text-xs leading-relaxed text-ink focus:border-accent focus:outline-none"
                        />
                    </div>

                    <div>
                        <span className="telemetry-label mb-2 block text-ink-secondary">
                            Live Structural Preview
                        </span>
                        <div className="h-[364px] overflow-y-auto rounded-xs border border-hairline bg-surface p-5">
                            {previewBlocks.length === 0 ? (
                                <p className="text-xs text-ink-muted">
                                    Start typing Markdown to preview article structure.
                                </p>
                            ) : (
                                <div className="space-y-3 text-sm leading-relaxed text-ink-secondary">
                                    {previewBlocks.map((block, idx) => {
                                        if (block.kind === 'h2') {
                                            return (
                                                <h2 key={idx} className="pt-2 font-grotesk text-lg font-medium text-ink">
                                                    {block.text}
                                                </h2>
                                            );
                                        }
                                        if (block.kind === 'h3') {
                                            return (
                                                <h3 key={idx} className="pt-1 font-grotesk text-base font-medium text-ink">
                                                    {block.text}
                                                </h3>
                                            );
                                        }
                                        if (block.kind === 'li') {
                                            return (
                                                <p key={idx} className="pl-4 text-xs text-ink-secondary">
                                                    &bull; {block.text}
                                                </p>
                                            );
                                        }
                                        return <p key={idx}>{block.text}</p>;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" variant="accent" disabled={form.processing}>
                        {form.processing ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/articles">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

AdminArticleForm.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminArticleForm;
