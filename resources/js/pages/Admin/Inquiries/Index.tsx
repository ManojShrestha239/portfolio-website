import { useState, type FormEvent, type ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { InquiryItem, InquiryStatus, SharedPageProps } from '@/types/portfolio';

interface InquiriesIndexProps extends SharedPageProps {
    readonly statusFilter: string | null;
    readonly inquiries: readonly InquiryItem[];
}

const STATUS_TABS: readonly { label: string; value: string | null }[] = [
    { label: 'All', value: null },
    { label: 'New', value: 'new' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Replied', value: 'replied' },
    { label: 'Archived', value: 'archived' },
];

function InquiryRow({ inquiry }: { readonly inquiry: InquiryItem }) {
    const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
    const [adminNotes, setAdminNotes] = useState<string>(inquiry.adminNotes ?? '');
    const [saving, setSaving] = useState<boolean>(false);

    const handleSave = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setSaving(true);
        router.patch(
            `/admin/inquiries/${inquiry.id}`,
            { status, admin_notes: adminNotes },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <article className="border border-hairline bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-4">
                <div>
                    <h2 className="font-grotesk text-lg font-medium text-ink">
                        {inquiry.name}{' '}
                        {inquiry.company && (
                            <span className="text-ink-muted">· {inquiry.company}</span>
                        )}
                    </h2>
                    <p className="font-mono text-xs text-ink-secondary">{inquiry.email}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {inquiry.scopeTags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-xs border border-accent/40 bg-canvas px-2 py-0.5 font-mono text-[10px] uppercase text-accent"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
                {inquiry.message}
            </p>

            <form onSubmit={handleSave} className="mt-5 grid grid-cols-1 gap-4 border-t border-hairline pt-4 lg:grid-cols-12">
                <div className="lg:col-span-3">
                    <label className="telemetry-label mb-1.5 block text-ink-muted">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                        className="h-9 w-full rounded-xs border border-hairline bg-canvas px-2.5 font-mono text-xs text-ink"
                    >
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="lg:col-span-7">
                    <label className="telemetry-label mb-1.5 block text-ink-muted">Internal Notes</label>
                    <input
                        type="text"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add follow-up notes..."
                        className="h-9 w-full rounded-xs border border-hairline bg-canvas px-3 text-xs text-ink"
                    />
                </div>

                <div className="flex items-end lg:col-span-2">
                    <Button type="submit" variant="accent" size="sm" className="w-full" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </article>
    );
}

function AdminInquiriesIndex({ statusFilter, inquiries }: InquiriesIndexProps) {
    return (
        <>
            <Head title="Inquiries Inbox" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                    <p className="telemetry-label text-accent">Lead Pipeline</p>
                    <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                        Inquiries &amp; Scope Inbox ({inquiries.length})
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((tab) => {
                        const active = statusFilter === tab.value;
                        const href = tab.value ? `/admin/inquiries?status=${tab.value}` : '/admin/inquiries';

                        return (
                            <Link
                                key={tab.label}
                                href={href}
                                className={cn(
                                    'rounded-xs border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors',
                                    active
                                        ? 'border-accent bg-accent text-canvas'
                                        : 'border-hairline bg-surface text-ink-secondary hover:text-ink',
                                )}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 space-y-5">
                {inquiries.length === 0 ? (
                    <div className="border border-hairline bg-surface p-8 text-sm text-ink-muted">
                        No inquiries match this filter.
                    </div>
                ) : (
                    inquiries.map((inquiry) => <InquiryRow key={inquiry.id} inquiry={inquiry} />)
                )}
            </div>
        </>
    );
}

AdminInquiriesIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminInquiriesIndex;
