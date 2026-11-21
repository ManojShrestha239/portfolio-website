<?php

declare(strict_types=1);

use App\Http\Middleware\EnsurePortfolioOwner;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use App\Support\ApiResponse;
use App\Support\HttpStatusCatalog;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            SecurityHeaders::class,
        ]);

        $middleware->api(append: [
            SecurityHeaders::class,
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
            $isApiOrJson = $request->is('api/*') || $request->expectsJson();

            // 1. Unified JSON / API error envelope for all 4xx / 5xx status codes
            if ($isApiOrJson && $status >= 400) {
                $preservedHeaders = [];
                foreach (['Retry-After', 'Allow', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'] as $header) {
                    $value = $response->headers->get($header);
                    if ($value !== null) {
                        $preservedHeaders[$header] = $value;
                    }
                }

                $errors = $exception instanceof ValidationException
                    ? $exception->errors()
                    : null;

                $message = null;
                if ($exception instanceof ValidationException) {
                    $message = $exception->getMessage();
                } elseif ($status < 500 && trim($exception->getMessage()) !== '') {
                    $message = $exception->getMessage();
                }

                return ApiResponse::error(
                    status: $status,
                    message: $message,
                    errors: $errors,
                    request: $request,
                    headers: $preservedHeaders,
                );
            }

            // 2. Web / Inertia CSRF expiry (419): redirect back cleanly with flash message
            if ($status === 419) {
                return back()->with('error', 'Your session expired. Please retry your submission.');
            }

            if (! in_array($status, HttpStatusCatalog::webErrorStatuses(), true)) {
                return $response;
            }

            // Preserve detailed stack traces in local debug mode for unexpected 500s
            if ($status === 500 && app()->hasDebugModeEnabled()) {
                return $response;
            }

            $meta = HttpStatusCatalog::describe($status);

            try {
                return Inertia::render('Public/Error', [
                    'status' => $meta['status'],
                    'title' => $meta['title'],
                    'summary' => $meta['summary'],
                    'diagnostic' => $meta['code'],
                    'path' => '/'.ltrim($request->path(), '/'),
                ])
                    ->toResponse($request)
                    ->setStatusCode($meta['status']);
            } catch (Throwable) {
                return $response;
            }
        });
    })->create();
