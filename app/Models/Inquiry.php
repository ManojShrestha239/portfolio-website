<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'email',
    'company',
    'scope_tags_json',
    'message',
    'ip_hash',
    'status',
    'admin_notes',
])]
class Inquiry extends Model
{
    public const STATUS_NEW = 'new';

    public const STATUS_IN_REVIEW = 'in_review';

    public const STATUS_REPLIED = 'replied';

    public const STATUS_ARCHIVED = 'archived';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope_tags_json' => 'array',
        ];
    }
}
