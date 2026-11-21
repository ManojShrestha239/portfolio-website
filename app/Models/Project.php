<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'title',
    'category',
    'is_flagship',
    'summary',
    'metrics_json',
    'tech_stack_json',
    'body_markdown',
    'body_html',
    'diagram_mermaid',
    'preview_image_path',
    'sort_order',
    'published_at',
])]
class Project extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_flagship' => 'boolean',
            'metrics_json' => 'array',
            'tech_stack_json' => 'array',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFlagship(Builder $query): Builder
    {
        return $query->where('is_flagship', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSecondary(Builder $query): Builder
    {
        return $query->where('is_flagship', false);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
