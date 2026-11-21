<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Requests\Public\StoreInquiryRequest;
use App\Services\PortfolioQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ContactController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(Request $request): Response
    {
        return Inertia::render('Public/Contact', [
            'siteSettings' => $this->portfolioQuery->getSiteSettings()->toArray(),
            'scopeOptions' => StoreInquiryRequest::ALLOWED_SCOPE_TAGS,
            'canonicalUrl' => url('/contact'),
        ]);
    }
}
