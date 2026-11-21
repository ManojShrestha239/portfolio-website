<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Data\ArticleData;
use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ArticleShowController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request, string $slug): Response
    {
        $article = $this->portfolioQuery->findPublishedArticleBySlug($slug);

        if ($article === null) {
            abort(404);
        }

        $related = array_values(array_filter(
            $this->portfolioQuery->getPublishedArticles(),
            static fn (ArticleData $item): bool => $item->slug !== $article->slug,
        ));

        return Inertia::render('Public/Writing/Show', [
            'article' => $article->toArray(),
            'relatedArticles' => array_map(
                static fn (ArticleData $item): array => $item->toArray(),
                array_slice($related, 0, 3),
            ),
            'canonicalUrl' => url("/writing/{$article->slug}"),
        ]);
    }
}
