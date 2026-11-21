<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Data\ArticleData;
use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingIndexController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request): Response
    {
        $allArticles = $this->portfolioQuery->getPublishedArticles();
        $activeTag = is_string($request->query('tag')) && trim((string) $request->query('tag')) !== ''
            ? trim((string) $request->query('tag'))
            : null;

        $allTags = [];
        foreach ($allArticles as $article) {
            foreach ($article->tags as $tag) {
                $allTags[$tag] = true;
            }
        }
        $uniqueTags = array_keys($allTags);
        sort($uniqueTags);

        $filtered = $activeTag !== null
            ? array_values(array_filter(
                $allArticles,
                static fn (ArticleData $article): bool => in_array($activeTag, $article->tags, true),
            ))
            : $allArticles;

        return Inertia::render('Public/Writing/Index', [
            'articles' => array_map(
                static fn (ArticleData $article): array => $article->toArray(),
                $filtered,
            ),
            'availableTags' => $uniqueTags,
            'activeTag' => $activeTag,
            'totalCount' => count($allArticles),
            'canonicalUrl' => url('/writing'),
        ]);
    }
}
