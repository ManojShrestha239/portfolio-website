import { useEffect, useState, type PropsWithChildren } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    FileText,
    FolderKanban,
    Inbox,
    LayoutDashboard,
    LogOut,
    Radio,
    ScrollText,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEcho } from '@/lib/echo';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/portfolio';

interface NavItem {
    readonly label: string;
    readonly href: string;
    readonly icon: typeof LayoutDashboard;
    readonly matchExact?: boolean;
}

interface RealtimeInquiryPayload {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly company: string | null;
    readonly scopeTags: readonly string[];
}

const NAV_ITEMS: readonly NavItem[] = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, matchExact: true },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Articles', href: '/admin/articles', icon: FileText },
    { label: 'Resume & CV', href: '/admin/resume', icon: ScrollText },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
];

export function AdminLayout({ children }: PropsWithChildren) {
    const page = usePage<SharedPageProps>();
    const { auth, flash, app } = page.props;
    const currentUrl = page.url;

    const [wsLive, setWsLive] = useState<boolean>(false);
    const [liveAlert, setLiveAlert] = useState<RealtimeInquiryPayload | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        if (currentUrl.startsWith('/admin/inquiries')) {
            setUnreadCount(0);
        }
    }, [currentUrl]);

    useEffect(() => {
        const echo = getEcho();
        if (!echo || !auth.user) {
            return;
        }

        const channel = echo.private('admin.inquiries');
        setWsLive(true);

        channel.listen('.inquiry.submitted', (payload: RealtimeInquiryPayload) => {
            setLiveAlert(payload);
            setUnreadCount((count) => count + 1);
            router.reload({
                only: ['inquiries', 'recentInquiries', 'stats'],
            });
        });

        return () => {
            echo.leave('admin.inquiries');
            setWsLive(false);
        };
    }, [auth.user]);

    const handleLogout = (): void => {
        router.post('/admin/logout');
    };

    return (
        <div className="flex min-h-screen bg-canvas text-ink">
            <aside className="flex w-64 shrink-0 flex-col border-r border-hairline bg-surface">
                <div className="flex h-16 items-center justify-between gap-2 border-b border-hairline px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-xs bg-accent" aria-hidden="true" />
                        <div className="min-w-0">
                            <p className="truncate font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink">
                                {app.owner}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
                                Portfolio CMS
                            </p>
                        </div>
                    </div>

                    {wsLive && (
                        <span
                            title="Laravel Reverb WebSocket connected"
                            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-success"
                        >
                            <Radio className="h-3 w-3" aria-hidden="true" />
                            <span>WS</span>
                        </span>
                    )}
                </div>

                <nav aria-label="Admin Navigation" className="flex-1 space-y-1 p-3">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = item.matchExact
                            ? currentUrl === item.href
                            : currentUrl.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center justify-between rounded-xs border px-3 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors',
                                    active
                                        ? 'border-accent/50 bg-surface-hover text-ink'
                                        : 'border-transparent text-ink-secondary hover:border-hairline hover:bg-surface-hover hover:text-ink',
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon
                                        className={cn(
                                            'h-4 w-4 shrink-0',
                                            active ? 'text-accent' : 'text-ink-muted',
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span>{item.label}</span>
                                </span>
                                {item.href === '/admin/inquiries' && unreadCount > 0 && (
                                    <span className="rounded-xs bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-canvas">
                                        +{unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-4">
                        <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                            Operations
                        </p>
                        <a
                            href="/horizon"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between rounded-xs border border-transparent px-3 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-secondary transition-colors hover:border-hairline hover:bg-surface-hover hover:text-ink"
                        >
                            <span className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                                <span>Horizon Queues</span>
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                        </a>
                        <Link
                            href="/"
                            className="flex items-center justify-between rounded-xs border border-transparent px-3 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-secondary transition-colors hover:border-hairline hover:bg-surface-hover hover:text-ink"
                        >
                            <span>Live Public Site</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                        </Link>
                    </div>
                </nav>

                <div className="border-t border-hairline p-4">
                    {auth.user && (
                        <p className="mb-3 truncate font-mono text-[11px] text-ink-muted">
                            {auth.user.email}
                        </p>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={handleLogout}
                    >
                        <span>Sign Out</span>
                        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {liveAlert && (
                    <div
                        role="status"
                        className="flex items-center justify-between gap-4 border-b border-accent/50 bg-surface px-8 py-3 font-mono text-xs text-ink"
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="h-2 w-2 rounded-xs bg-accent" aria-hidden="true" />
                            <span>
                                Live Scope Brief from <strong className="text-accent">{liveAlert.name}</strong>
                                {liveAlert.company ? ` (${liveAlert.company})` : ''}
                            </span>
                            <Link
                                href="/admin/inquiries"
                                onClick={() => setLiveAlert(null)}
                                className="underline hover:text-accent"
                            >
                                Inspect Inbox &rarr;
                            </Link>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLiveAlert(null)}
                            aria-label="Dismiss notification"
                            className="cursor-pointer text-ink-muted hover:text-ink"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                    </div>
                )}

                {flash.success && (
                    <div
                        role="status"
                        className="border-b border-success/40 bg-surface px-8 py-3 font-mono text-xs text-success"
                    >
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div
                        role="alert"
                        className="border-b border-danger/40 bg-surface px-8 py-3 font-mono text-xs text-danger"
                    >
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
