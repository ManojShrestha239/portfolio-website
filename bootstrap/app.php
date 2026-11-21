<?php

declare(strict_types=1);

use App\Http\Middleware\EnsurePortfolioOwner;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'owner' => EnsurePortfolioOwner::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request): string => route('admin.login'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request): bool => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request): Response {
            $status = $response->getStatusCode();

            if ($request->is('api/*') || $request->expectsJson()) {
                return $response;
            }

            if (! in_array($status, [403, 404, 500, 502, 503], true)) {
                return $response;
            }

            // Preserve detailed stack traces in local debug mode for unexpected 500s
            if ($status === 500 && app()->hasDebugModeEnabled()) {
                return $response;
            }

            $meta = match ($status) {
                403 => [
                    'title' => 'Access Restricted',
                    'summary' => 'Owner authorization is required to access this route.',
                    'diagnostic' => 'AUTH_POLICY_DENIED · SINGLE_OWNER_BOUNDARY',
                ],
                404 => [
                    'title' => 'Route Not Found',
                    'summary' => 'The requested document, case study, or endpoint does not exist on this host.',
                    'diagnostic' => 'HTTP_404_UNRESOLVED · VERIFY_SLUG_OR_INDEX',
                ],
                502 => [
                    'title' => 'Bad Gateway',
                    'summary' => 'The upstream PHP-FPM application runtime returned an invalid response.',
                    'diagnostic' => 'UPSTREAM_GATEWAY_FAULT · RETRY_SHORTLY',
                ],
                503 => [
                    'title' => 'Service Unavailable',
                    'summary' => 'The portfolio is temporarily offline for scheduled maintenance or deployment.',
                    'diagnostic' => 'MAINTENANCE_MODE_ACTIVE · ZERO_DATA_LOSS',
                ],
                default => [
                    'title' => 'Internal Server Error',
                    'summary' => 'An unexpected runtime exception interrupted processing of this request.',
                    'diagnostic' => 'RUNTIME_FAULT · LOGGED_FOR_INSPECTION',
                ],
            };

            try {
                return Inertia::render('Public/Error', [
                    'status' => $status,
                    'title' => $meta['title'],
                    'summary' => $meta['summary'],
                    'diagnostic' => $meta['diagnostic'],
                    'path' => '/'.ltrim($request->path(), '/'),
                ])
                    ->toResponse($request)
                    ->setStatusCode($status);
            } catch (Throwable) {
                return $response;
            }
        });
    })->create();
