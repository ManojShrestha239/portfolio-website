<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Jobs\OptimizeUploadedMediaJob;
use App\Models\Project;
use App\Support\MarkdownRenderer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class UpsertProjectAction
{
    public function __construct(
        private readonly MarkdownRenderer $markdown,
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?Project $project = null, ?UploadedFile $previewImage = null): Project
    {
        $previousSlug = $project?->slug;
        $previewPath = $project?->preview_image_path;

        if ($previewImage !== null) {
            $extension = $previewImage->guessExtension() ?: 'png';
            $filename = Str::uuid()->toString().'.'.$extension;
            $storedPath = $previewImage->storeAs('projects', $filename, 'public');

            if (is_string($storedPath)) {
                if ($previewPath !== null && Storage::disk('public')->exists($previewPath)) {
                    Storage::disk('public')->delete($previewPath);
                }
                $previewPath = $storedPath;
                OptimizeUploadedMediaJob::dispatch($storedPath, 'public');
            }
        }

        $bodyMarkdown = (string) $validated['body_markdown'];
        $isPublished = (bool) $validated['is_published'];

        $publishedAt = $isPublished
            ? ($project?->published_at ?? now())
            : null;

        $attributes = [
            'title' => (string) $validated['title'],
            'slug' => (string) $validated['slug'],
            'category' => (string) $validated['category'],
            'is_flagship' => (bool) $validated['is_flagship'],
            'summary' => (string) $validated['summary'],
            'metrics_json' => array_values((array) $validated['metrics']),
            'tech_stack_json' => array_values((array) $validated['tech_stack']),
            'body_markdown' => $bodyMarkdown,
            'body_html' => $this->markdown->toHtml($bodyMarkdown),
            'diagram_mermaid' => isset($validated['diagram_mermaid']) && trim((string) $validated['diagram_mermaid']) !== ''
                ? (string) $validated['diagram_mermaid']
                : null,
            'preview_image_path' => $previewPath,
            'sort_order' => (int) $validated['sort_order'],
            'published_at' => $publishedAt,
        ];

        if ($project === null) {
            $project = Project::query()->create($attributes);
        } else {
            $project->update($attributes);
        }

        $slugsToBust = array_values(array_filter(array_unique([
            $previousSlug,
            $project->slug,
        ])));

        $this->clearCache->execute(projects: true, projectSlugs: $slugsToBust);

        return $project->refresh();
    }
}
