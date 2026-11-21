export interface TelemetryMetric {
    readonly label: string;
    readonly value: string;
    readonly unit: string;
}

export interface ProjectMetric {
    readonly label: string;
    readonly value: string;
    readonly unit?: string;
}

export interface ProjectItem {
    readonly id: number;
    readonly slug: string;
    readonly title: string;
    readonly category: string;
    readonly isFlagship: boolean;
    readonly summary: string;
    readonly metrics: readonly ProjectMetric[];
    readonly techStack: readonly string[];
    readonly bodyMarkdown: string;
    readonly bodyHtml: string;
    readonly diagramMermaid: string | null;
    readonly previewImagePath: string | null;
    readonly sortOrder: number;
    readonly publishedAt: string | null;
}

export interface ArticleItem {
    readonly id: number;
    readonly slug: string;
    readonly title: string;
    readonly excerpt: string;
    readonly targetAudience: string;
    readonly tags: readonly string[];
    readonly bodyMarkdown: string;
    readonly bodyHtml: string;
    readonly readingTimeMins: number;
    readonly publishedAt: string | null;
}

export interface SiteSettings {
    readonly heroHeadline: string;
    readonly heroSubheadline: string;
    readonly availabilityStatus: string;
    readonly activeCvPath: string | null;
    readonly telemetry: readonly TelemetryMetric[];
}

export interface AuthUser {
    readonly id: number;
    readonly name: string;
    readonly email: string;
}

export interface SharedPageProps extends Record<string, unknown> {
    readonly app: {
        readonly name: string;
        readonly owner: string;
        readonly role: string;
        readonly location: string;
    };
    readonly auth: {
        readonly user: AuthUser | null;
    };
    readonly flash: {
        readonly success: string | null;
        readonly error: string | null;
    };
}

export interface HomePageProps extends SharedPageProps {
    readonly siteSettings: SiteSettings;
    readonly telemetry: readonly TelemetryMetric[];
    readonly flagshipProjects: readonly ProjectItem[];
    readonly secondaryProjects: readonly ProjectItem[];
    readonly recentArticles: readonly ArticleItem[];
}
