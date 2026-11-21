<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Data\ArticleData;
use App\Data\ProjectData;
use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request): Response
    {
        $settings = $this->portfolioQuery->getSiteSettings();
        $flagshipProjects = $this->portfolioQuery->getFlagshipProjects();
        $secondaryProjects = $this->portfolioQuery->getSecondaryProjects();
        $recentArticles = array_slice($this->portfolioQuery->getPublishedArticles(), 0, 4);

        return Inertia::render('Public/Home', [
            'siteSettings' => $settings->toArray(),
            'telemetry' => $settings->telemetry,
            'flagshipProjects' => array_map(
                static fn (ProjectData $project): array => $project->toArray(),
                $flagshipProjects,
            ),
            'secondaryProjects' => array_map(
                static fn (ProjectData $project): array => $project->toArray(),
                $secondaryProjects,
            ),
            'recentArticles' => array_map(
                static fn (ArticleData $article): array => $article->toArray(),
                $recentArticles,
            ),
        ]);
    }
}
