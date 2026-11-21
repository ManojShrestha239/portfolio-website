import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type { AdminDashboardStats, InquiryItem, SharedPageProps } from '@/types/portfolio';

interface DashboardProps extends SharedPageProps {
    readonly stats: AdminDashboardStats;
    readonly recentInquiries: readonly InquiryItem[];
}

function AdminDashboard({ stats, recentInquiries }: DashboardProps) {
    const cards = [
        {
            label: 'Projects Published',
            value: `${stats.projectsPublished} / ${stats.projectsTotal}`,
            meta: `${stats.projectsFlagship} Flagship Showcases`,
        },
        {
            label: 'Technical Articles',
            value: `${stats.articlesPublished} / ${stats.articlesTotal}`,
            meta: 'Markdown + Live Preview',
        },
        {
            label: 'New Inquiries',
            value: String(stats.inquiriesNew),
            meta: `${stats.inquiriesTotal} Total Submissions`,
        },
        {
            label: 'Aggregated Views',
            value: String(stats.pageViewsTotal),
            meta: 'Daily Page Telemetry',
        },
    ];

    return (
        <>
            <Head title="CMS Overview" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Control Plane</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        Portfolio CMS Overview
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/articles/create">
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>New Article</span>
                        </Link>
                    </Button>
                    <Button variant="accent" size="sm" asChild>
                        <Link href="/admin/projects/create">
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>New Project</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="bg-surface p-6">
                        <p className="telemetry-label text-ink-muted">{card.label}</p>
                        <p className="mt-3 font-grotesk text-3xl font-semibold text-ink">
                            {card.value}
                        </p>
                        <p className="mt-2 font-mono text-[11px] text-ink-secondary">
                            {card.meta}
                        </p>
                    </div>
                ))}
            </div>

            <section className="mt-10 border border-hairline bg-surface">
                <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                    <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
                        Recent Scope Inquiries
                    </h2>
                    <Link
                        href="/admin/inquiries"
                        className="font-mono text-xs uppercase tracking-[0.08em] text-accent hover:underline"
                    >
                        Open Inbox &rarr;
                    </Link>
                </div>

                {recentInquiries.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-ink-muted">
                        No scope inquiries submitted yet.
                    </p>
                ) : (
                    <div className="divide-y divide-hairline">
                        {recentInquiries.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                            >
                                <div>
                                    <p className="text-sm font-medium text-ink">
                                        {inquiry.name}{' '}
                                        {inquiry.company && (
                                            <span className="text-ink-muted">
                                                · {inquiry.company}
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-1 line-clamp-1 text-xs text-ink-secondary">
                                        {inquiry.message}
                                    </p>
                                </div>
                                <span className="rounded-xs border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                                    {inquiry.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;
