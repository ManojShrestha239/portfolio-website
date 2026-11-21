<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Data\InquiryData;
use App\Services\AdminQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController
{
    public function __construct(
        private readonly AdminQueryService $adminQuery,
    ) {}

    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->adminQuery->getDashboardStats(),
            'recentInquiries' => array_map(
                static fn (InquiryData $inquiry): array => $inquiry->toArray(),
                $this->adminQuery->getRecentInquiries(5),
            ),
        ]);
    }
}
