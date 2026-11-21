import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
    readonly status: number;
    readonly title: string;
    readonly summary: string;
    readonly diagnostic: string;
    readonly path: string;
}

const STATUS_META: Record<
    number,
    { readonly title: string; readonly summary: string; readonly diagnostic: string }
> = {
    400: {
        title: 'Bad Request',
        summary: 'The request payload or query parameters could not be parsed.',
        diagnostic: 'BAD_REQUEST',
    },
    401: {
        title: 'Authentication Required',
        summary: 'Valid owner credentials are required to access this endpoint.',
        diagnostic: 'UNAUTHENTICATED',
    },
    403: {
        title: 'Access Restricted',
        summary: 'Owner authorization is required to access this resource.',
        diagnostic: 'AUTH_POLICY_DENIED',
    },
    404: {
        title: 'Route Not Found',
        summary: 'The requested document, case study, or endpoint does not exist on this host.',
        diagnostic: 'RESOURCE_NOT_FOUND',
    },
    405: {
        title: 'Method Not Allowed',
        summary: 'The HTTP verb used is not supported for this route.',
        diagnostic: 'METHOD_NOT_ALLOWED',
    },
    419: {
        title: 'Session Expired',
        summary: 'Your security token expired. Reload the page and retry your request.',
        diagnostic: 'CSRF_TOKEN_MISMATCH',
    },
    429: {
        title: 'Too Many Requests',
        summary: 'Request rate limit exceeded. Wait briefly before retrying.',
        diagnostic: 'RATE_LIMIT_EXCEEDED',
    },
    500: {
        title: 'Internal Server Error',
        summary: 'An unexpected runtime exception interrupted processing of this request.',
        diagnostic: 'INTERNAL_SERVER_ERROR',
    },
    502: {
        title: 'Bad Gateway',
        summary: 'The upstream PHP-FPM application runtime returned an invalid response.',
        diagnostic: 'UPSTREAM_GATEWAY_FAULT',
    },
    503: {
        title: 'Service Unavailable',
        summary: 'The portfolio is temporarily offline for scheduled maintenance or deployment.',
        diagnostic: 'SERVICE_UNAVAILABLE',
    },
    504: {
        title: 'Gateway Timeout',
        summary: 'The upstream runtime did not complete the request within the timeout window.',
        diagnostic: 'GATEWAY_TIMEOUT',
    },
};

export default function ErrorPage({ status, title, summary, diagnostic, path }: ErrorPageProps) {
    const fallback = STATUS_META[status] ?? {
        title: 'System Error',
        summary: 'An unexpected HTTP error occurred while serving this request.',
        diagnostic: `HTTP_${status}_FAULT`,
    };

    const resolvedTitle = title || fallback.title;
    const resolvedSummary = summary || fallback.summary;
    const resolvedDiagnostic = diagnostic || fallback.diagnostic;

    const handleReload = (): void => {
        window.location.reload();
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
            <Head title={`${status} — ${resolvedTitle}`} />

            <div
                aria-hidden="true"
                className="architectural-grid-layer pointer-events-none fixed inset-0 z-0 opacity-55"
            />

            <header className="relative z-10 border-b border-hairline bg-canvas/95">
                <div className="mx-auto flex h-[4.25rem] max-w-[1680px] items-center justify-between px-5 lg:px-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center border border-accent font-mono text-[11px] text-accent transition-colors group-hover:bg-accent group-hover:text-canvas">
                            MS
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-secondary group-hover:text-ink">
                            Manoj Shrestha
                        </span>
                    </Link>

                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                        HTTP {status}
                    </span>
                </div>
            </header>

            <main className="relative z-10 flex flex-1 items-center px-5 py-16 lg:px-8">
                <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 items-end gap-12 border-y border-hairline py-14 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <p className="telemetry-label text-accent">
                            Status Response · Edition 01
                        </p>
                        <div className="display-monumental outline-txt mt-4 text-[clamp(5.5rem,18vw,13.5rem)] leading-none">
                            {status}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-6">
                        <div className="border-l border-accent pl-5">
                            <h1 className="font-grotesk text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                                {resolvedTitle}
                            </h1>
                            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-secondary">
                                {resolvedSummary}
                            </p>
                        </div>

                        <dl className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
                            <div className="bg-surface p-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                                    Diagnostic Code
                                </dt>
                                <dd className="mt-1.5 font-mono text-xs text-accent">
                                    {resolvedDiagnostic}
                                </dd>
                            </div>
                            <div className="bg-surface p-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                                    Requested Path
                                </dt>
                                <dd className="mt-1.5 truncate font-mono text-xs text-ink">
                                    {path || '/'}
                                </dd>
                            </div>
                        </dl>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Button variant="accent" size="default" asChild>
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                    <span>Return to Index</span>
                                </Link>
                            </Button>

                            {(status === 500 || status === 502 || status === 503) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="default"
                                    onClick={handleReload}
                                >
                                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                    <span>Retry Request</span>
                                </Button>
                            )}

                            {status === 404 && (
                                <Button variant="outline" size="default" asChild>
                                    <Link href="/writing">Browse Writing</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 border-t border-hairline bg-canvas px-5 py-6 lg:px-8">
                <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    <span>&copy; {new Date().getFullYear()} Manoj Shrestha</span>
                    <span>Laravel 13 · Industrial Editorial Dark</span>
                </div>
            </footer>
        </div>
    );
}
