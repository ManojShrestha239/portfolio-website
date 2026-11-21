<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'role_title',
    'organization',
    'period',
    'highlights_json',
    'sort_order',
])]
class Experience extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'highlights_json' => 'array',
            'sort_order' => 'integer',
        ];
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
