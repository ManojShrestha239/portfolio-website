import type { FormEvent, ReactNode } from 'react';
import { useForm } from '@inertiajs/react';
import { Check, Send } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import { MagneticButton } from '@/motion/MagneticButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SharedPageProps, SiteSettings } from '@/types/portfolio';

interface ContactPageProps extends SharedPageProps {
    readonly siteSettings: SiteSettings;
    readonly scopeOptions: readonly string[];
    readonly canonicalUrl: string;
}

function Contact({ siteSettings, scopeOptions, canonicalUrl, flash, app }: ContactPageProps) {
    const form = useForm<{
        name: string;
        email: string;
        company: string;
        scope_tags: string[];
        message: string;
        website: string;
    }>({
        name: '',
        email: '',
        company: '',
        scope_tags: [scopeOptions[0] ?? 'Multi-Tenant SaaS'],
        message: '',
        website: '',
    });

    const toggleTag = (tag: string): void => {
        if (form.data.scope_tags.includes(tag)) {
            if (form.data.scope_tags.length === 1) {
                return;
            }
            form.setData(
                'scope_tags',
                form.data.scope_tags.filter((item) => item !== tag),
            );
        } else {
            form.setData('scope_tags', [...form.data.scope_tags, tag]);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post('/inquiries', {
            preserveScroll: true,
            onSuccess: () => form.reset('name', 'email', 'company', 'message', 'website'),
        });
    };

    return (
        <>
            <SeoHead
                title="Contact & Project Scope"
                description={`Initiate a technical architecture consultation, multi-tenant SaaS build, industrial hardware bridge, or senior engineering role discussion with ${app.owner}.`}
                url={canonicalUrl}
            />

            <section className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-24">
                <header className="border-b border-hairline pb-10">
                    <p className="telemetry-label text-accent">
                        Direct Channel · {siteSettings.availabilityStatus}
                    </p>
                    <h1 className="editorial-display mt-3 text-[clamp(2.6rem,6vw,5.2rem)] font-normal text-ink">
                        Initiate a Technical Scope.
                    </h1>
                    <p className="mt-5 max-w-[60ch] text-base text-ink-secondary">
                        Share your system constraints, target milestones, or engineering team
                        requirements. Every brief is logged directly to the CMS inbox and dispatched
                        via Redis + Horizon.
                    </p>
                </header>

                <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        {flash.success && (
                            <div
                                role="status"
                                className="mb-6 flex items-center gap-3 border border-success/40 bg-surface px-5 py-4 text-sm text-success"
                            >
                                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <span>{flash.success}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 border border-hairline bg-surface p-8"
                        >
                            <div>
                                <span className="telemetry-label mb-3 block text-ink-secondary">
                                    Select Engagement Scope
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {scopeOptions.map((tag) => {
                                        const active = form.data.scope_tags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={cn(
                                                    'cursor-pointer rounded-xs border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.06em] transition-colors',
                                                    active
                                                        ? 'border-accent bg-accent text-canvas'
                                                        : 'border-hairline bg-canvas text-ink-secondary hover:border-ink-muted hover:text-ink',
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                                {form.errors.scope_tags && (
                                    <p className="mt-1.5 font-mono text-xs text-danger">
                                        {form.errors.scope_tags}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="contact-name"
                                        className="telemetry-label mb-1.5 block text-ink-secondary"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 font-mono text-xs text-danger">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-email"
                                        className="telemetry-label mb-1.5 block text-ink-secondary"
                                    >
                                        Work Email
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        required
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                    />
                                    {form.errors.email && (
                                        <p className="mt-1 font-mono text-xs text-danger">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-company"
                                    className="telemetry-label mb-1.5 block text-ink-secondary"
                                >
                                    Organization (Optional)
                                </label>
                                <input
                                    id="contact-company"
                                    type="text"
                                    value={form.data.company}
                                    onChange={(e) => form.setData('company', e.target.value)}
                                    className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                />
                            </div>

                            <div
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    left: '-9999px',
                                    width: '1px',
                                    height: '1px',
                                    overflow: 'hidden',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                }}
                            >
                                <input
                                    type="text"
                                    name="hp_check"
                                    tabIndex={-1}
                                    autoComplete="new-password"
                                    data-lpignore="true"
                                    data-1p-ignore="true"
                                    value={form.data.website}
                                    onChange={(e) => form.setData('website', e.target.value)}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="telemetry-label mb-1.5 block text-ink-secondary"
                                >
                                    Project Brief &amp; Constraints
                                </label>
                                <textarea
                                    id="contact-message"
                                    rows={6}
                                    required
                                    minLength={15}
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                    className="w-full rounded-xs border border-hairline bg-canvas p-3 text-sm text-ink focus:border-accent focus:outline-none"
                                />
                                {form.errors.message && (
                                    <p className="mt-1 font-mono text-xs text-danger">
                                        {form.errors.message}
                                    </p>
                                )}
                            </div>

                            {Object.keys(form.errors).length > 0 && (
                                <div
                                    role="alert"
                                    className="border border-danger/50 bg-canvas px-4 py-3 font-mono text-xs text-danger"
                                >
                                    {Object.values(form.errors)[0]}
                                </div>
                            )}

                            <MagneticButton>
                                <Button type="submit" variant="accent" size="lg" disabled={form.processing}>
                                    <Send className="h-4 w-4" aria-hidden="true" />
                                    <span>{form.processing ? 'Submitting...' : 'Send Scope Brief'}</span>
                                </Button>
                            </MagneticButton>
                        </form>
                    </div>

                    <aside className="space-y-6 lg:col-span-5">
                        <div className="border border-hairline bg-surface p-6">
                            <p className="telemetry-label text-accent">Engagement Focus</p>
                            <ul className="mt-4 space-y-3 text-sm text-ink-secondary">
                                <li>&bull; Multi-tenant Laravel SaaS architecture &amp; migrations</li>
                                <li>&bull; High-throughput streaming ETL &amp; RS-232/FFM hardware bridges</li>
                                <li>&bull; Zero-trust HMAC licensing gateways &amp; OWASP hardening</li>
                                <li>&bull; Principal / Senior Full-Stack Engineering roles</li>
                            </ul>
                        </div>

                        <div className="border border-hairline bg-surface p-6">
                            <p className="telemetry-label text-ink-muted">Location &amp; Timezone</p>
                            <p className="mt-2 font-grotesk text-lg text-ink">{app.location}</p>
                            <p className="mt-1 text-xs text-ink-secondary">
                                Asynchronous-first collaboration across APAC, EMEA, and US overlap windows.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Contact;
