<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Jobs\RecordPageViewJob;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class TrackPublicPageView
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (
            $request->isMethod('GET')
            && $response->getStatusCode() === 200
            && ! $request->is('admin*', 'horizon*', 'sitemap.xml', 'up')
        ) {
            $referer = $request->headers->get('referer');
            $referrerDomain = is_string($referer) ? parse_url($referer, PHP_URL_HOST) : null;

            RecordPageViewJob::dispatch(
                path: $request->getPathInfo(),
                referrerDomain: is_string($referrerDomain) ? $referrerDomain : null,
                viewedDate: now()->toDateString(),
            );
        }

        return $response;
    }
}
