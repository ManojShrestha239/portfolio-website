import type { ReactNode } from 'react';
import { Download } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { SeoHead } from '@/components/domain/SeoHead';
import { MagneticButton } from '@/motion/MagneticButton';
import { Button } from '@/components/ui/button';
import type {
    ExperienceItem,
    SharedPageProps,
    SiteSettings,
    SkillGroupItem,
} from '@/types/portfolio';

interface ResumeProps extends SharedPageProps {
    readonly resume: {
        readonly experiences: readonly ExperienceItem[];
        readonly skillGroups: readonly SkillGroupItem[];
        readonly activeCvPath: string | null;
    };
    readonly siteSettings: SiteSettings;
    readonly canonicalUrl: string;
}

function Resume({ resume, siteSettings, canonicalUrl, app }: ResumeProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: app.owner,
        jobTitle: app.role,
        url: canonicalUrl,
        knowsAbout: resume.skillGroups.flatMap((group) => group.skills),
    };

    return (
        <>
            <SeoHead
                title="Engineering Resume & Skills Matrix"
                description={`${app.owner} — ${app.role}. Dynamic STAR experience timeline and verified systems engineering skills matrix.`}
                url={canonicalUrl}
                type="profile"
                jsonLd={jsonLd}
            />

            <section className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-24">
                <header className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-10">
                    <div>
                        <p className="telemetry-label text-accent">
                            Verified Dossier · {siteSettings.availabilityStatus}
                        </p>
                        <h1 className="editorial-display mt-3 text-[clamp(2.6rem,6vw,5.2rem)] font-normal text-ink">
                            Curriculum Vitae &amp; Capabilities.
                        </h1>
                        <p className="mt-4 max-w-[60ch] text-base text-ink-secondary">
                            {app.owner} — {app.role}
                        </p>
                    </div>

                    {resume.activeCvPath && (
                        <MagneticButton>
                            <Button variant="accent" size="default" asChild>
                                <a
                                    href={`/storage/${resume.activeCvPath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                >
                                    <Download className="h-4 w-4" aria-hidden="true" />
                                    <span>Download CV (PDF)</span>
                                </a>
                            </Button>
                        </MagneticButton>
                    )}
                </header>

                <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
                    <section className="lg:col-span-7">
                        <p className="telemetry-label mb-8 text-accent">
                            01 · Production Experience Timeline (STAR)
                        </p>
                        <div className="space-y-10">
                            {resume.experiences.map((exp, idx) => (
                                <article
                                    key={exp.id}
                                    className="border border-hairline bg-surface p-8"
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline pb-4">
                                        <div>
                                            <span className="font-mono text-xs text-accent">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <h2 className="mt-1 font-grotesk text-2xl font-medium text-ink">
                                                {exp.roleTitle}
                                            </h2>
                                            <p className="mt-1 font-mono text-xs text-ink-secondary">
                                                {exp.organization}
                                            </p>
                                        </div>
                                        <span className="rounded-xs border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] uppercase text-ink-muted">
                                            {exp.period}
                                        </span>
                                    </div>

                                    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-secondary">
                                        {exp.highlights.map((bullet, bIdx) => (
                                            <li key={bIdx} className="flex gap-3">
                                                <span
                                                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-xs bg-accent"
                                                    aria-hidden="true"
                                                />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="lg:col-span-5">
                        <p className="telemetry-label mb-8 text-accent">
                            02 · Core Technical Skills Matrix
                        </p>
                        <div className="space-y-6">
                            {resume.skillGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="border border-hairline bg-surface p-6"
                                >
                                    <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
                                        {group.category}
                                    </h3>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {group.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-xs border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
}

Resume.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Resume;
