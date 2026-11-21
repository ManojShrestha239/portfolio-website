<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Article;
use App\Support\MarkdownRenderer;

final class UpsertArticleAction
{
    public function __construct(
        private readonly MarkdownRenderer $markdown,
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?Article $article = null): Article
    {
        $previousSlug = $article?->slug;
        $bodyMarkdown = (string) $validated['body_markdown'];
        $isPublished = (bool) $validated['is_published'];

        $publishedAt = $isPublished
            ? ($article?->published_at ?? now())
            : null;

        $attributes = [
            'title' => (string) $validated['title'],
            'slug' => (string) $validated['slug'],
            'excerpt' => (string) $validated['excerpt'],
            'target_audience' => (string) $validated['target_audience'],
            'tags_json' => array_values((array) $validated['tags']),
            'body_markdown' => $bodyMarkdown,
            'body_html' => $this->markdown->toHtml($bodyMarkdown),
            'reading_time_mins' => $this->markdown->estimateReadingTimeMins($bodyMarkdown),
            'published_at' => $publishedAt,
        ];

        if ($article === null) {
            $article = Article::query()->create($attributes);
        } else {
            $article->update($attributes);
        }

        $slugsToBust = array_values(array_filter(array_unique([
            $previousSlug,
            $article->slug,
        ])));

        $this->clearCache->execute(articles: true, articleSlugs: $slugsToBust);

        return $article->refresh();
    }
}
