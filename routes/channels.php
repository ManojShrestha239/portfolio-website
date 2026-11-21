<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('admin.inquiries', static function (User $user): bool {
    return (bool) $user->is_owner;
});
