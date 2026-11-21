import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    readonly title: string;
    readonly description: string;
    readonly url?: string;
    readonly type?: 'website' | 'article' | 'profile';
    readonly jsonLd?: Record<string, unknown>;
}

export function SeoHead({
    title,
    description,
    url,
    type = 'website',
    jsonLd,
}: SeoHeadProps) {
    return (
        <Head title={title}>
            <meta head-key="description" name="description" content={description} />
            <meta head-key="og:title" property="og:title" content={title} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:type" property="og:type" content={type} />
            {url && <meta head-key="og:url" property="og:url" content={url} />}
            {url && <link head-key="canonical" rel="canonical" href={url} />}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />
            {jsonLd && (
                <script
                    head-key="jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
}
