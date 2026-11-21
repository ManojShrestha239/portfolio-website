<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Article;

final class DeleteArticleAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    public function execute(Article $article): void
    {
        $slug = $article->slug;
        $article->delete();

        $this->clearCache->execute(articles: true, articleSlugs: [$slug]);
    }
}
