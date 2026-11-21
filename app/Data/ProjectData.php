<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Project;

final readonly class ProjectData
{
    /**
     * @param  list<array{label: string, value: string, unit?: string}>  $metrics
     * @param  list<string>  $techStack
     */
    public function __construct(
        public int $id,
        public string $slug,
        public string $title,
        public string $category,
        public bool $isFlagship,
        public string $summary,
        public array $metrics,
        public array $techStack,
        public string $bodyMarkdown,
        public string $bodyHtml,
        public ?string $diagramMermaid,
        public ?string $previewImagePath,
        public int $sortOrder,
        public ?string $publishedAt,
    ) {}

    public static function fromModel(Project $project): self
    {
        /** @var list<array{label: string, value: string, unit?: string}> $metrics */
        $metrics = array_values(is_array($project->metrics_json) ? $project->metrics_json : []);

        /** @var list<string> $techStack */
        $techStack = array_values(is_array($project->tech_stack_json) ? $project->tech_stack_json : []);

        return new self(
            id: (int) $project->id,
            slug: (string) $project->slug,
            title: (string) $project->title,
            category: (string) $project->category,
            isFlagship: (bool) $project->is_flagship,
            summary: (string) $project->summary,
            metrics: $metrics,
            techStack: $techStack,
            bodyMarkdown: (string) $project->body_markdown,
            bodyHtml: (string) $project->body_html,
            diagramMermaid: $project->diagram_mermaid !== null ? (string) $project->diagram_mermaid : null,
            previewImagePath: $project->preview_image_path !== null ? (string) $project->preview_image_path : null,
            sortOrder: (int) $project->sort_order,
            publishedAt: $project->published_at?->toIso8601String(),
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<array{label: string, value: string, unit?: string}> $metrics */
        $metrics = is_array($data['metrics'] ?? null) ? array_values($data['metrics']) : [];

        /** @var list<string> $techStack */
        $techStack = is_array($data['techStack'] ?? null) ? array_values($data['techStack']) : [];

        return new self(
            id: (int) ($data['id'] ?? 0),
            slug: (string) ($data['slug'] ?? ''),
            title: (string) ($data['title'] ?? ''),
            category: (string) ($data['category'] ?? ''),
            isFlagship: (bool) ($data['isFlagship'] ?? false),
            summary: (string) ($data['summary'] ?? ''),
            metrics: $metrics,
            techStack: $techStack,
            bodyMarkdown: (string) ($data['bodyMarkdown'] ?? ''),
            bodyHtml: (string) ($data['bodyHtml'] ?? ''),
            diagramMermaid: isset($data['diagramMermaid']) && is_string($data['diagramMermaid']) ? $data['diagramMermaid'] : null,
            previewImagePath: isset($data['previewImagePath']) && is_string($data['previewImagePath']) ? $data['previewImagePath'] : null,
            sortOrder: (int) ($data['sortOrder'] ?? 0),
            publishedAt: isset($data['publishedAt']) && is_string($data['publishedAt']) ? $data['publishedAt'] : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'isFlagship' => $this->isFlagship,
            'summary' => $this->summary,
            'metrics' => $this->metrics,
            'techStack' => $this->techStack,
            'bodyMarkdown' => $this->bodyMarkdown,
            'bodyHtml' => $this->bodyHtml,
            'diagramMermaid' => $this->diagramMermaid,
            'previewImagePath' => $this->previewImagePath,
            'sortOrder' => $this->sortOrder,
            'publishedAt' => $this->publishedAt,
        ];
    }
}
