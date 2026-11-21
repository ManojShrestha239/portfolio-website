<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\DeleteArticleAction;
use App\Actions\Admin\UpsertArticleAction;
use App\Data\ArticleData;
use App\Http\Requests\Admin\UpsertArticleRequest;
use App\Models\Article;
use App\Services\AdminQueryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ArticleController
{
    public function __construct(
        private readonly AdminQueryService $adminQuery,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Articles/Index', [
            'articles' => array_map(
                static fn (ArticleData $article): array => $article->toArray(),
                $this->adminQuery->getAllArticles(),
            ),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Form', [
            'article' => null,
        ]);
    }

    public function store(UpsertArticleRequest $request, UpsertArticleAction $action): RedirectResponse
    {
        $action->execute(validated: $request->validated(), article: null);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article created and portfolio cache invalidated.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Articles/Form', [
            'article' => ArticleData::fromModel($article)->toArray(),
        ]);
    }

    public function update(
        UpsertArticleRequest $request,
        Article $article,
        UpsertArticleAction $action,
    ): RedirectResponse {
        $action->execute(validated: $request->validated(), article: $article);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article updated and portfolio cache invalidated.');
    }

    public function destroy(Article $article, DeleteArticleAction $action): RedirectResponse
    {
        $action->execute($article);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article deleted and portfolio cache invalidated.');
    }
}
