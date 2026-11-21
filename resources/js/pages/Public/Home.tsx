import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowDownRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import type { HomePageProps } from '@/types/portfolio';

function Home({ telemetry, app }: HomePageProps) {
    return (
        <>
            <Head title="Enterprise SaaS & Industrial Automation Architect" />

            <section className="mx-auto max-w-[1380px] px-6 pb-20 pt-20 lg:px-10 lg:pt-28">
                <div className="grid grid-cols-1 gap-10 border-b border-hairline pb-16 lg:grid-cols-12">
                    <div className="lg:col-span-9">
                        <p className="telemetry-label mb-6 flex items-center gap-3 text-ink-secondary">
                            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
                            <span>Engineering Dossier · 6+ Years · 13 Enterprise Repositories</span>
                        </p>

                        <h1 className="editorial-display text-[clamp(3.2rem,8vw,7.5rem)] font-normal text-ink">
                            Enterprise SaaS &amp; Industrial Systems Architecture.
                        </h1>
                    </div>

                    <div className="flex flex-col justify-end gap-6 lg:col-span-3">
                        <p className="max-w-[34ch] text-sm leading-relaxed text-ink-secondary">
                            {app.owner} engineers high-throughput Laravel multi-tenant platforms,
                            streaming ETL pipelines, and RS-232 hardware-to-web automation deployed
                            across 500+ industrial terminals.
                        </p>

                        <div id="scope-anchor" className="flex flex-wrap items-center gap-3">
                            <Button variant="accent" size="default" asChild>
                                <a href="#capabilities">
                                    <span>Inspect Architecture</span>
                                    <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    id="telemetry"
                    className="grid grid-cols-2 border-b border-hairline lg:grid-cols-4"
                >
                    {telemetry.map((metric, idx) => (
                        <div
                            key={metric.label}
                            className={`flex flex-col justify-between gap-4 py-8 pr-6 ${
                                idx > 0 ? 'lg:border-l lg:border-hairline lg:pl-6' : ''
                            } ${idx % 2 === 1 ? 'border-l border-hairline pl-6 lg:border-l' : ''}`}
                        >
                            <span className="telemetry-label text-ink-muted">
                                0{idx + 1} · {metric.label}
                            </span>
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="font-grotesk text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                                    {metric.value}
                                </span>
                                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
                                    {metric.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section
                id="capabilities"
                className="mx-auto max-w-[1380px] px-6 pb-28 lg:px-10"
            >
                <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2">
                    <article className="flex flex-col justify-between gap-6 bg-surface p-8">
                        <span className="telemetry-label text-accent">
                            01 · Industrial Hardware &amp; Streaming ETL
                        </span>
                        <div className="space-y-3">
                            <h2 className="font-grotesk text-2xl font-medium tracking-tight text-ink">
                                Paint Formulation &amp; Robotic Dispensing Suite
                            </h2>
                            <p className="max-w-[54ch] text-sm text-ink-secondary">
                                Deployed across 10 enterprise paint brands powering 500+ retail
                                dealer terminals with 100,000+ cell Excel ingestion in under 45
                                seconds on 64MB RAM and RS-232/FFM hardware bridging down to 1/192
                                fl oz.
                            </p>
                        </div>
                    </article>

                    <article className="flex flex-col justify-between gap-6 bg-surface p-8">
                        <span className="telemetry-label text-accent">
                            02 · Multi-Tenant SaaS &amp; Zero-Trust Licensing
                        </span>
                        <div className="space-y-3">
                            <h2 className="font-grotesk text-2xl font-medium tracking-tight text-ink">
                                FieldMA SaaS &amp; Bihani HMAC Gateway
                            </h2>
                            <p className="max-w-[54ch] text-sm text-ink-secondary">
                                Database-per-tenant Laravel architecture cutting client onboarding
                                from 3 days to under 5 minutes, eliminating 51% of legacy mobile
                                endpoints, and enforcing HMAC SHA-256 + Redis nonce licensing.
                            </p>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Home;
