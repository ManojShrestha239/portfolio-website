import type { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
    const form = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post('/admin/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
            <Head title="Owner Sign In" />

            <div className="w-full max-w-md border border-hairline bg-surface p-8">
                <div className="mb-8 flex items-center justify-between border-b border-hairline pb-5">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-xs bg-accent" aria-hidden="true" />
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink">
                            Single-Owner CMS
                        </span>
                    </div>
                    <Lock className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                </div>

                <h1 className="font-grotesk text-2xl font-medium tracking-tight text-ink">
                    Sign in to Portfolio CMS
                </h1>
                <p className="mt-2 text-sm text-ink-secondary">
                    Restricted administrative access. Public registration is disabled.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="telemetry-label mb-2 block text-ink-secondary"
                        >
                            Owner Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            required
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                        />
                        {form.errors.email && (
                            <p className="mt-1.5 font-mono text-xs text-danger">
                                {form.errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="telemetry-label mb-2 block text-ink-secondary"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                        />
                        {form.errors.password && (
                            <p className="mt-1.5 font-mono text-xs text-danger">
                                {form.errors.password}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2.5 text-xs text-ink-secondary">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.target.checked)}
                            className="h-3.5 w-3.5 rounded-xs border-hairline bg-canvas accent-accent"
                        />
                        <span>Keep session active on this device</span>
                    </label>

                    <Button
                        type="submit"
                        variant="accent"
                        size="default"
                        className="w-full"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 border-t border-hairline pt-4">
                    <Link
                        href="/"
                        className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
                    >
                        &larr; Return to Public Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
