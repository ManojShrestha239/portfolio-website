<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Article;

final readonly class ArticleData
{
    /**
     * @param  list<string>  $tags
     */
    public function __construct(
        public int $id,
        public string $slug,
        public string $title,
        public string $excerpt,
        public string $targetAudience,
        public array $tags,
        public string $bodyMarkdown,
        public string $bodyHtml,
        public int $readingTimeMins,
        public ?string $publishedAt,
    ) {}

    public static function fromModel(Article $article): self
    {
        /** @var list<string> $tags */
        $tags = array_values(is_array($article->tags_json) ? $article->tags_json : []);

        return new self(
            id: (int) $article->id,
            slug: (string) $article->slug,
            title: (string) $article->title,
            excerpt: (string) $article->excerpt,
            targetAudience: (string) $article->target_audience,
            tags: $tags,
            bodyMarkdown: (string) $article->body_markdown,
            bodyHtml: (string) $article->body_html,
            readingTimeMins: (int) $article->reading_time_mins,
            publishedAt: $article->published_at?->toIso8601String(),
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<string> $tags */
        $tags = is_array($data['tags'] ?? null) ? array_values($data['tags']) : [];

        return new self(
            id: (int) ($data['id'] ?? 0),
            slug: (string) ($data['slug'] ?? ''),
            title: (string) ($data['title'] ?? ''),
            excerpt: (string) ($data['excerpt'] ?? ''),
            targetAudience: (string) ($data['targetAudience'] ?? ''),
            tags: $tags,
            bodyMarkdown: (string) ($data['bodyMarkdown'] ?? ''),
            bodyHtml: (string) ($data['bodyHtml'] ?? ''),
            readingTimeMins: (int) ($data['readingTimeMins'] ?? 1),
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
            'excerpt' => $this->excerpt,
            'targetAudience' => $this->targetAudience,
            'tags' => $this->tags,
            'bodyMarkdown' => $this->bodyMarkdown,
            'bodyHtml' => $this->bodyHtml,
            'readingTimeMins' => $this->readingTimeMins,
            'publishedAt' => $this->publishedAt,
        ];
    }
}
