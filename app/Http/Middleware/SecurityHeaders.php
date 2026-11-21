<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->remove('X-Powered-By');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');

        if ($request->isSecure() || app()->isProduction()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload',
            );
        }

        $isLocal = app()->isLocal();
        $vitePort = (int) env('VITE_PORT', 5173);
        $reverbHost = (string) env('VITE_REVERB_HOST', 'localhost');
        $reverbPort = (int) env('VITE_REVERB_PORT', 8080);
        $reverbScheme = (string) env('VITE_REVERB_SCHEME', 'http') === 'https' ? 'wss' : 'ws';
        $reverbOrigin = sprintf('%s://%s:%d', $reverbScheme, $reverbHost, $reverbPort);

        $devOrigins = sprintf('localhost:%d 127.0.0.1:%d', $vitePort, $vitePort);

        $scriptSrc = $isLocal
            ? "'self' 'unsafe-inline' 'unsafe-eval' {$devOrigins}"
            : "'self' 'unsafe-inline'";
        $connectSrc = $isLocal
            ? "'self' {$reverbOrigin} {$devOrigins} ws://localhost:{$vitePort} ws://127.0.0.1:{$vitePort}"
            : "'self' {$reverbOrigin}";

        $csp = implode('; ', [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            "connect-src {$connectSrc}",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ]);

        $response->headers->set('Content-Security-Policy', $csp);

        if ($request->is('admin', 'admin/*', 'horizon', 'horizon/*')) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        }

        return $response;
    }
}
