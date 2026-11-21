import type { ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type { ProjectItem, SharedPageProps } from '@/types/portfolio';

interface ProjectsIndexProps extends SharedPageProps {
    readonly projects: readonly ProjectItem[];
}

function AdminProjectsIndex({ projects }: ProjectsIndexProps) {
    const handleDelete = (project: ProjectItem): void => {
        if (!window.confirm(`Delete "${project.title}"? This immediately updates the live site.`)) {
            return;
        }
        router.delete(`/admin/projects/${project.id}`);
    };

    return (
        <>
            <Head title="Projects CMS" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Architecture Portfolio</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        Projects ({projects.length})
                    </h1>
                </div>

                <Button variant="accent" size="sm" asChild>
                    <Link href="/admin/projects/create">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Create Project</span>
                    </Link>
                </Button>
            </div>

            <div className="mt-8 overflow-x-auto border border-hairline bg-surface">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-hairline bg-canvas/60 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Tier</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-surface-hover">
                                <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">
                                    #{project.sortOrder}
                                </td>
                                <td className="px-4 py-3.5">
                                    <p className="font-medium text-ink">{project.title}</p>
                                    <p className="font-mono text-xs text-ink-muted">
                                        /work/{project.slug} · {project.category}
                                    </p>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="rounded-xs border border-hairline bg-canvas px-2 py-0.5 font-mono text-[11px] uppercase text-ink-secondary">
                                        {project.isFlagship ? 'Flagship' : 'Secondary'}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span
                                        className={
                                            project.publishedAt
                                                ? 'font-mono text-xs text-success'
                                                : 'font-mono text-xs text-ink-muted'
                                        }
                                    >
                                        {project.publishedAt ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/projects/${project.id}/edit`}>
                                                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                                                <span>Edit</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(project)}
                                            aria-label={`Delete ${project.title}`}
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

AdminProjectsIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminProjectsIndex;
