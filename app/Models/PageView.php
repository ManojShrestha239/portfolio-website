<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'path',
    'referrer_domain',
    'viewed_date',
    'count',
])]
class PageView extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'viewed_date' => 'date',
            'count' => 'integer',
        ];
    }
}
