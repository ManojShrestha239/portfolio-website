<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Data\ProjectData;
use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectShowController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request, string $slug): Response
    {
        $project = $this->portfolioQuery->findPublishedProjectBySlug($slug);

        if ($project === null) {
            abort(404);
        }

        $related = array_values(array_filter(
            $this->portfolioQuery->getPublishedProjects(),
            static fn (ProjectData $item): bool => $item->slug !== $project->slug,
        ));

        return Inertia::render('Public/Work/Show', [
            'project' => $project->toArray(),
            'relatedProjects' => array_map(
                static fn (ProjectData $item): array => $item->toArray(),
                array_slice($related, 0, 3),
            ),
            'canonicalUrl' => url("/work/{$project->slug}"),
        ]);
    }
}
