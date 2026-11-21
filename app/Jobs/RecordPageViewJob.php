<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\PageView;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Queue\Queueable;

final class RecordPageViewJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public function __construct(
        public readonly string $path,
        public readonly ?string $referrerDomain,
        public readonly string $viewedDate,
    ) {
        $this->onQueue('telemetry');
    }

    public function handle(): void
    {
        $normalizedPath = '/'.ltrim(substr($this->path, 0, 250), '/');

        $updated = PageView::query()
            ->where('path', $normalizedPath)
            ->whereDate('viewed_date', $this->viewedDate)
            ->increment('count');

        if ($updated > 0) {
            return;
        }

        try {
            PageView::query()->create([
                'path' => $normalizedPath,
                'referrer_domain' => $this->referrerDomain !== null ? substr($this->referrerDomain, 0, 250) : null,
                'viewed_date' => $this->viewedDate,
                'count' => 1,
            ]);
        } catch (QueryException) {
            // Concurrent worker inserted first; safely increment the existing daily row
            PageView::query()
                ->where('path', $normalizedPath)
                ->whereDate('viewed_date', $this->viewedDate)
                ->increment('count');
        }
    }
}
