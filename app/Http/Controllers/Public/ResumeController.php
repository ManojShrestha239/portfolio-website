<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ResumeController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request): Response
    {
        return Inertia::render('Public/Resume', [
            'resume' => $this->portfolioQuery->getResumeData()->toArray(),
            'siteSettings' => $this->portfolioQuery->getSiteSettings()->toArray(),
            'canonicalUrl' => url('/resume'),
        ]);
    }
}
