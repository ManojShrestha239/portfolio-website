<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\HorizonApplicationServiceProvider;

final class HorizonServiceProvider extends HorizonApplicationServiceProvider
{
    public function boot(): void
    {
        parent::boot();
    }

    protected function gate(): void
    {
        Gate::define('viewHorizon', static function (?User $user = null): bool {
            if ($user === null) {
                return false;
            }

            return (bool) ($user->is_owner ?? false);
        });
    }
}
