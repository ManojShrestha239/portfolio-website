import type { FormEvent, ReactNode } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import type {
    ExperienceItem,
    SharedPageProps,
    SiteSettings,
    SkillGroupItem,
} from '@/types/portfolio';

interface ResumeCmsProps extends SharedPageProps {
    readonly experiences: readonly ExperienceItem[];
    readonly skillGroups: readonly SkillGroupItem[];
    readonly siteSettings: SiteSettings;
}

function AdminResumeIndex({ experiences, skillGroups, siteSettings }: ResumeCmsProps) {
    const settingsForm = useForm<{
        hero_headline: string;
        hero_subheadline: string;
        availability_status: string;
        cv_pdf: File | null;
    }>({
        hero_headline: siteSettings.heroHeadline,
        hero_subheadline: siteSettings.heroSubheadline,
        availability_status: siteSettings.availabilityStatus,
        cv_pdf: null,
    });

    const experienceForm = useForm({
        role_title: '',
        organization: '',
        period: '',
        highlights_text: '',
        sort_order: experiences.length + 1,
    });

    const skillForm = useForm({
        category: '',
        skills_text: '',
        sort_order: skillGroups.length + 1,
    });

    const submitSettings = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        settingsForm.post('/admin/resume/settings', { forceFormData: true });
    };

    const submitExperience = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const highlights = experienceForm.data.highlights_text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        experienceForm.transform((data) => ({
            role_title: data.role_title,
            organization: data.organization,
            period: data.period,
            highlights,
            sort_order: data.sort_order,
        }));

        experienceForm.post('/admin/resume/experiences', {
            onSuccess: () => experienceForm.reset(),
        });
    };

    const submitSkillGroup = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const skills = skillForm.data.skills_text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        skillForm.transform((data) => ({
            category: data.category,
            skills,
            sort_order: data.sort_order,
        }));

        skillForm.post('/admin/resume/skills', {
            onSuccess: () => skillForm.reset(),
        });
    };

    return (
        <>
            <Head title="Resume, Skills & CV" />

            <div className="border-b border-hairline pb-6">
                <p className="telemetry-label text-accent">Dynamic Dossier</p>
                <h1 className="mt-1 font-grotesk text-3xl font-medium tracking-tight text-ink">
                    Resume, Skills &amp; Active CV PDF
                </h1>
            </div>

            <div className="mt-8 space-y-10">
                <section className="border border-hairline bg-surface p-6">
                    <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
                        Hero Copy, Availability &amp; Downloadable CV PDF
                    </h2>
                    <form onSubmit={submitSettings} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="hero_headline" className="telemetry-label mb-1.5 block text-ink-secondary">
                                Hero Headline
                            </label>
                            <input
                                id="hero_headline"
                                type="text"
                                required
                                value={settingsForm.data.hero_headline}
                                onChange={(e) => settingsForm.setData('hero_headline', e.target.value)}
                                className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink"
                            />
                        </div>
                        <div>
                            <label htmlFor="hero_subheadline" className="telemetry-label mb-1.5 block text-ink-secondary">
                                Hero Subheadline
                            </label>
                            <textarea
                                id="hero_subheadline"
                                rows={2}
                                required
                                value={settingsForm.data.hero_subheadline}
                                onChange={(e) => settingsForm.setData('hero_subheadline', e.target.value)}
                                className="w-full rounded-xs border border-hairline bg-canvas p-3 text-sm text-ink"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="availability_status" className="telemetry-label mb-1.5 block text-ink-secondary">
                                    Availability Status
                                </label>
                                <input
                                    id="availability_status"
                                    type="text"
                                    required
                                    value={settingsForm.data.availability_status}
                                    onChange={(e) => settingsForm.setData('availability_status', e.target.value)}
                                    className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink"
                                />
                            </div>
                            <div>
                                <label htmlFor="cv_pdf" className="telemetry-label mb-1.5 block text-ink-secondary">
                                    Upload Active CV PDF (max 10MB)
                                </label>
                                <input
                                    id="cv_pdf"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => settingsForm.setData('cv_pdf', e.target.files?.[0] ?? null)}
                                    className="block w-full text-xs text-ink-secondary file:mr-3 file:rounded-xs file:border file:border-hairline file:bg-canvas file:px-3 file:py-2 file:font-mono file:text-xs file:text-ink"
                                />
                                {siteSettings.activeCvPath && (
                                    <p className="mt-1.5 font-mono text-[11px] text-success">
                                        Active CV: /storage/{siteSettings.activeCvPath}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" variant="accent" size="sm" disabled={settingsForm.processing}>
                            {settingsForm.processing ? 'Saving...' : 'Save Settings & CV'}
                        </Button>
                    </form>
                </section>

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="border border-hairline bg-surface p-6">
                        <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
                            Experience Timeline ({experiences.length})
                        </h2>
                        <div className="mt-4 divide-y divide-hairline">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="flex items-start justify-between gap-4 py-4">
                                    <div>
                                        <p className="font-medium text-ink">{exp.roleTitle}</p>
                                        <p className="font-mono text-xs text-ink-muted">
                                            {exp.organization} · {exp.period}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.delete(`/admin/resume/experiences/${exp.id}`)}
                                        aria-label={`Delete ${exp.roleTitle}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={submitExperience} className="mt-6 space-y-3 border-t border-hairline pt-5">
                            <p className="telemetry-label text-accent">Add Experience Entry</p>
                            <input
                                type="text"
                                required
                                placeholder="Role Title"
                                value={experienceForm.data.role_title}
                                onChange={(e) => experienceForm.setData('role_title', e.target.value)}
                                className="h-9 w-full rounded-xs border border-hairline bg-canvas px-3 text-xs text-ink"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Organization"
                                    value={experienceForm.data.organization}
                                    onChange={(e) => experienceForm.setData('organization', e.target.value)}
                                    className="h-9 rounded-xs border border-hairline bg-canvas px-3 text-xs text-ink"
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Period (e.g. 2020 – Present)"
                                    value={experienceForm.data.period}
                                    onChange={(e) => experienceForm.setData('period', e.target.value)}
                                    className="h-9 rounded-xs border border-hairline bg-canvas px-3 text-xs text-ink"
                                />
                            </div>
                            <textarea
                                rows={3}
                                required
                                placeholder="STAR highlights (one per line)"
                                value={experienceForm.data.highlights_text}
                                onChange={(e) => experienceForm.setData('highlights_text', e.target.value)}
                                className="w-full rounded-xs border border-hairline bg-canvas p-3 text-xs text-ink"
                            />
                            <Button type="submit" variant="outline" size="sm" disabled={experienceForm.processing}>
                                Add Experience
                            </Button>
                        </form>
                    </div>

                    <div className="border border-hairline bg-surface p-6">
                        <h2 className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
                            Skill Matrix Groups ({skillGroups.length})
                        </h2>
                        <div className="mt-4 divide-y divide-hairline">
                            {skillGroups.map((group) => (
                                <div key={group.id} className="flex items-start justify-between gap-4 py-4">
                                    <div>
                                        <p className="font-medium text-ink">{group.category}</p>
                                        <p className="mt-1 font-mono text-xs text-ink-secondary">
                                            {group.skills.join(' · ')}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.delete(`/admin/resume/skills/${group.id}`)}
                                        aria-label={`Delete ${group.category}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={submitSkillGroup} className="mt-6 space-y-3 border-t border-hairline pt-5">
                            <p className="telemetry-label text-accent">Add Skill Group</p>
                            <input
                                type="text"
                                required
                                placeholder="Category Name"
                                value={skillForm.data.category}
                                onChange={(e) => skillForm.setData('category', e.target.value)}
                                className="h-9 w-full rounded-xs border border-hairline bg-canvas px-3 text-xs text-ink"
                            />
                            <textarea
                                rows={3}
                                required
                                placeholder="Comma-separated skills"
                                value={skillForm.data.skills_text}
                                onChange={(e) => skillForm.setData('skills_text', e.target.value)}
                                className="w-full rounded-xs border border-hairline bg-canvas p-3 font-mono text-xs text-ink"
                            />
                            <Button type="submit" variant="outline" size="sm" disabled={skillForm.processing}>
                                Add Skill Group
                            </Button>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}

AdminResumeIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminResumeIndex;
