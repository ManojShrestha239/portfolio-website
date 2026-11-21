import type { FormEvent, ReactNode } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type { ProjectItem, ProjectMetric, SharedPageProps } from '@/types/portfolio';

interface ProjectFormProps extends SharedPageProps {
    readonly project: ProjectItem | null;
}

interface EditableMetric {
    label: string;
    value: string;
    unit: string;
}

function AdminProjectForm({ project }: ProjectFormProps) {
    const isEditing = project !== null;

    const initialMetrics: EditableMetric[] = project
        ? project.metrics.map((m: ProjectMetric) => ({
              label: m.label,
              value: m.value,
              unit: m.unit ?? '',
          }))
        : [{ label: '', value: '', unit: '' }];

    const form = useForm<{
        title: string;
        slug: string;
        category: string;
        is_flagship: boolean;
        summary: string;
        metrics: EditableMetric[];
        tech_stack: string[];
        tech_stack_text: string;
        body_markdown: string;
        diagram_mermaid: string;
        preview_image: File | null;
        sort_order: number;
        is_published: boolean;
    }>({
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        category: project?.category ?? '',
        is_flagship: project?.isFlagship ?? false,
        summary: project?.summary ?? '',
        metrics: initialMetrics,
        tech_stack: project ? [...project.techStack] : [],
        tech_stack_text: project ? project.techStack.join(', ') : '',
        body_markdown: project?.bodyMarkdown ?? '',
        diagram_mermaid: project?.diagramMermaid ?? '',
        preview_image: null,
        sort_order: project?.sortOrder ?? 10,
        is_published: project ? project.publishedAt !== null : true,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const parsedTechStack = form.data.tech_stack_text
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        form.transform((data) => ({
            title: data.title,
            slug: data.slug,
            category: data.category,
            is_flagship: data.is_flagship ? 1 : 0,
            summary: data.summary,
            metrics: data.metrics,
            tech_stack: parsedTechStack,
            body_markdown: data.body_markdown,
            diagram_mermaid: data.diagram_mermaid,
            preview_image: data.preview_image,
            sort_order: data.sort_order,
            is_published: data.is_published ? 1 : 0,
        }));

        const target = isEditing ? `/admin/projects/${project.id}` : '/admin/projects';
        form.post(target, { forceFormData: true });
    };

    const addMetricRow = (): void => {
        form.setData('metrics', [...form.data.metrics, { label: '', value: '', unit: '' }]);
    };

    const removeMetricRow = (index: number): void => {
        form.setData(
            'metrics',
            form.data.metrics.filter((_, idx) => idx !== index),
        );
    };

    const updateMetric = (index: number, field: keyof EditableMetric, value: string): void => {
        const next = form.data.metrics.map((row, idx) =>
            idx === index ? { ...row, [field]: value } : row,
        );
        form.setData('metrics', next);
    };

    return (
        <>
            <Head title={isEditing ? `Edit ${project.title}` : 'Create Project'} />

            <div className="flex items-center justify-between border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Projects CMS</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        {isEditing ? 'Edit Project' : 'Create Project'}
                    </h1>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/projects">&larr; Back to Projects</Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 max-w-4xl space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label htmlFor="category" className="telemetry-label mb-2 block text-ink-secondary">
                            Category
                        </label>
                        <input
                            id="category"
                            type="text"
                            required
                            value={form.data.category}
                            onChange={(e) => form.setData('category', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="sort_order" className="telemetry-label mb-2 block text-ink-secondary">
                            Sort Order
                        </label>
                        <input
                            id="sort_order"
                            type="number"
                            min={0}
                            value={form.data.sort_order}
                            onChange={(e) => form.setData('sort_order', Number(e.target.value))}
                            className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 font-mono text-sm text-ink focus:border-accent focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 border border-hairline bg-surface p-4">
                    <label className="flex items-center gap-2.5 text-sm text-ink">
                        <input
                            type="checkbox"
                            checked={form.data.is_flagship}
                            onChange={(e) => form.setData('is_flagship', e.target.checked)}
                            className="h-4 w-4 accent-accent"
                        />
                        <span>Flagship Architecture Showcase</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-ink">
                        <input
                            type="checkbox"
                            checked={form.data.is_published}
                            onChange={(e) => form.setData('is_published', e.target.checked)}
                            className="h-4 w-4 accent-accent"
                        />
                        <span>Published on Live Site</span>
                    </label>
                </div>

                <div>
                    <label htmlFor="summary" className="telemetry-label mb-2 block text-ink-secondary">
                        Executive Summary
                    </label>
                    <textarea
                        id="summary"
                        rows={3}
                        required
                        value={form.data.summary}
                        onChange={(e) => form.setData('summary', e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="border border-hairline bg-surface p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="telemetry-label text-ink-secondary">Verified Metrics</span>
                        <Button type="button" variant="outline" size="sm" onClick={addMetricRow}>
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Add Metric</span>
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {form.data.metrics.map((metric, idx) => (
                            <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    required
                                    value={metric.label}
                                    onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                                    className="h-9 rounded-xs border border-hairline bg-canvas px-2.5 text-xs text-ink sm:col-span-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    required
                                    value={metric.value}
                                    onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                                    className="h-9 rounded-xs border border-hairline bg-canvas px-2.5 font-mono text-xs text-ink sm:col-span-3"
                                />
                                <input
                                    type="text"
                                    placeholder="Unit / Context"
                                    value={metric.unit}
                                    onChange={(e) => updateMetric(idx, 'unit', e.target.value)}
                                    className="h-9 rounded-xs border border-hairline bg-canvas px-2.5 text-xs text-ink sm:col-span-4"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={form.data.metrics.length <= 1}
                                    onClick={() => removeMetricRow(idx)}
                                    className="sm:col-span-1"
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="tech_stack_text" className="telemetry-label mb-2 block text-ink-secondary">
                        Tech Stack (comma-separated)
                    </label>
                    <input
                        id="tech_stack_text"
                        type="text"
                        required
                        value={form.data.tech_stack_text}
                        onChange={(e) => form.setData('tech_stack_text', e.target.value)}
                        className="h-10 w-full rounded-xs border border-hairline bg-surface px-3 font-mono text-xs text-ink focus:border-accent focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="body_markdown" className="telemetry-label mb-2 block text-ink-secondary">
                        Case Study Body (Markdown)
                    </label>
                    <textarea
                        id="body_markdown"
                        rows={10}
                        required
                        value={form.data.body_markdown}
                        onChange={(e) => form.setData('body_markdown', e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface p-3 font-mono text-xs text-ink focus:border-accent focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="diagram_mermaid" className="telemetry-label mb-2 block text-ink-secondary">
                        Architecture Diagram (Mermaid)
                    </label>
                    <textarea
                        id="diagram_mermaid"
                        rows={6}
                        value={form.data.diagram_mermaid}
                        onChange={(e) => form.setData('diagram_mermaid', e.target.value)}
                        className="w-full rounded-xs border border-hairline bg-surface p-3 font-mono text-xs text-ink focus:border-accent focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="preview_image" className="telemetry-label mb-2 block text-ink-secondary">
                        Preview Image (JPEG/PNG/WebP, max 5MB — optimized async via Horizon)
                    </label>
                    <input
                        id="preview_image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => form.setData('preview_image', e.target.files?.[0] ?? null)}
                        className="block w-full text-xs text-ink-secondary file:mr-4 file:rounded-xs file:border file:border-hairline file:bg-surface file:px-4 file:py-2 file:font-mono file:text-xs file:text-ink"
                    />
                    {project?.previewImagePath && (
                        <p className="mt-2 font-mono text-xs text-ink-muted">
                            Current file: /storage/{project.previewImagePath}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" variant="accent" disabled={form.processing}>
                        {form.processing ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/projects">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

AdminProjectForm.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminProjectForm;
