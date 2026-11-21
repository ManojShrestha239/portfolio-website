<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Support\PortfolioCacheKeys;
use Illuminate\Support\Facades\Cache;

final class ClearPortfolioCacheAction
{
    /**
     * @param  list<string>  $projectSlugs
     * @param  list<string>  $articleSlugs
     */
    public function execute(
        bool $projects = false,
        bool $articles = false,
        bool $resume = false,
        bool $siteSettings = false,
        array $projectSlugs = [],
        array $articleSlugs = [],
    ): void {
        $clearAll = ! $projects && ! $articles && ! $resume && ! $siteSettings
            && $projectSlugs === [] && $articleSlugs === [];

        if ($clearAll || $projects) {
            Cache::forget(PortfolioCacheKeys::PROJECTS_PUBLISHED);
        }

        if ($clearAll || $articles) {
            Cache::forget(PortfolioCacheKeys::ARTICLES_PUBLISHED);
        }

        if ($clearAll || $resume) {
            Cache::forget(PortfolioCacheKeys::RESUME);
        }

        if ($clearAll || $siteSettings) {
            Cache::forget(PortfolioCacheKeys::SITE_SETTINGS);
        }

        foreach ($projectSlugs as $slug) {
            if ($slug !== '') {
                Cache::forget(PortfolioCacheKeys::projectBySlug($slug));
            }
        }

        foreach ($articleSlugs as $slug) {
            if ($slug !== '') {
                Cache::forget(PortfolioCacheKeys::articleBySlug($slug));
            }
        }
    }
}
