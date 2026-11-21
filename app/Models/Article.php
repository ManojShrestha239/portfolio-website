<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'title',
    'excerpt',
    'target_audience',
    'tags_json',
    'body_markdown',
    'body_html',
    'reading_time_mins',
    'published_at',
])]
class Article extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags_json' => 'array',
            'reading_time_mins' => 'integer',
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
    public function scopeLatestPublished(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
