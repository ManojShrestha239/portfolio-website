<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Data\ArticleData;
use App\Data\ProjectData;
use App\Services\PortfolioQueryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PortfolioApiController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function health(Request $request): JsonResponse
    {
        return ApiResponse::ok(
            data: [
                'service' => 'portfolio-api',
                'status' => 'healthy',
            ],
            message: 'Service operational.',
            request: $request,
        );
    }

    public function projects(Request $request): JsonResponse
    {
        $projects = array_map(
            static fn (ProjectData $project): array => $project->toArray(),
            $this->portfolioQuery->getPublishedProjects(),
        );

        return ApiResponse::ok(
            data: $projects,
            message: 'Published projects retrieved.',
            meta: ['count' => count($projects)],
            request: $request,
        );
    }

    public function showProject(Request $request, string $slug): JsonResponse
    {
        $project = $this->portfolioQuery->findPublishedProjectBySlug($slug);

        if ($project === null) {
            return ApiResponse::error(
                status: 404,
                message: "Project '{$slug}' was not found.",
                request: $request,
            );
        }

        return ApiResponse::ok(
            data: $project->toArray(),
            message: 'Project retrieved.',
            request: $request,
        );
    }

    public function articles(Request $request): JsonResponse
    {
        $articles = array_map(
            static fn (ArticleData $article): array => $article->toArray(),
            $this->portfolioQuery->getPublishedArticles(),
        );

        return ApiResponse::ok(
            data: $articles,
            message: 'Published articles retrieved.',
            meta: ['count' => count($articles)],
            request: $request,
        );
    }

    public function showArticle(Request $request, string $slug): JsonResponse
    {
        $article = $this->portfolioQuery->findPublishedArticleBySlug($slug);

        if ($article === null) {
            return ApiResponse::error(
                status: 404,
                message: "Article '{$slug}' was not found.",
                request: $request,
            );
        }

        return ApiResponse::ok(
            data: $article->toArray(),
            message: 'Article retrieved.',
            request: $request,
        );
    }

    public function resume(Request $request): JsonResponse
    {
        return ApiResponse::ok(
            data: $this->portfolioQuery->getResumeData()->toArray(),
            message: 'Resume dossier retrieved.',
            request: $request,
        );
    }
}
