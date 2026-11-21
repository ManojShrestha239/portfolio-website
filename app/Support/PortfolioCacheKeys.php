<?php

declare(strict_types=1);

namespace App\Support;

final class PortfolioCacheKeys
{
    public const TTL_SECONDS = 3600;

    public const PROJECTS_PUBLISHED = 'portfolio:projects:published';

    public const ARTICLES_PUBLISHED = 'portfolio:articles:published';

    public const RESUME = 'portfolio:resume';

    public const SITE_SETTINGS = 'portfolio:site_settings';

    public static function projectBySlug(string $slug): string
    {
        return "portfolio:projects:slug:{$slug}";
    }

    public static function articleBySlug(string $slug): string
    {
        return "portfolio:articles:slug:{$slug}";
    }
}
