<?php

declare(strict_types=1);

namespace App\Support;

final class HttpStatusCatalog
{
    /**
     * @return array{status: int, code: string, title: string, summary: string}
     */
    public static function describe(int $status): array
    {
        return match ($status) {
            400 => [
                'status' => 400,
                'code' => 'BAD_REQUEST',
                'title' => 'Bad Request',
                'summary' => 'The request payload or query parameters could not be parsed.',
            ],
            401 => [
                'status' => 401,
                'code' => 'UNAUTHENTICATED',
                'title' => 'Authentication Required',
                'summary' => 'Valid owner credentials are required to access this endpoint.',
            ],
            403 => [
                'status' => 403,
                'code' => 'AUTH_POLICY_DENIED',
                'title' => 'Access Restricted',
                'summary' => 'Owner authorization is required to access this resource.',
            ],
            404 => [
                'status' => 404,
                'code' => 'RESOURCE_NOT_FOUND',
                'title' => 'Route Not Found',
                'summary' => 'The requested document, case study, or endpoint does not exist on this host.',
            ],
            405 => [
                'status' => 405,
                'code' => 'METHOD_NOT_ALLOWED',
                'title' => 'Method Not Allowed',
                'summary' => 'The HTTP verb used is not supported for this route.',
            ],
            419 => [
                'status' => 419,
                'code' => 'CSRF_TOKEN_MISMATCH',
                'title' => 'Session Expired',
                'summary' => 'Your security token expired. Reload the page and retry your request.',
            ],
            422 => [
                'status' => 422,
                'code' => 'VALIDATION_FAILED',
                'title' => 'Validation Failed',
                'summary' => 'One or more submitted fields failed validation checks.',
            ],
            429 => [
                'status' => 429,
                'code' => 'RATE_LIMIT_EXCEEDED',
                'title' => 'Too Many Requests',
                'summary' => 'Request rate limit exceeded. Wait briefly before retrying.',
            ],
            502 => [
                'status' => 502,
                'code' => 'UPSTREAM_GATEWAY_FAULT',
                'title' => 'Bad Gateway',
                'summary' => 'The upstream PHP-FPM application runtime returned an invalid response.',
            ],
            503 => [
                'status' => 503,
                'code' => 'SERVICE_UNAVAILABLE',
                'title' => 'Service Unavailable',
                'summary' => 'The portfolio is temporarily offline for scheduled maintenance or deployment.',
            ],
            504 => [
                'status' => 504,
                'code' => 'GATEWAY_TIMEOUT',
                'title' => 'Gateway Timeout',
                'summary' => 'The upstream runtime did not complete the request within the timeout window.',
            ],
            default => [
                'status' => $status >= 400 ? $status : 500,
                'code' => $status >= 400 ? "HTTP_{$status}_FAULT" : 'INTERNAL_SERVER_ERROR',
                'title' => 'Internal Server Error',
                'summary' => 'An unexpected runtime exception interrupted processing of this request.',
            ],
        };
    }

    /**
     * Status codes rendered through the custom Inertia Public/Error view on web requests.
     *
     * @return list<int>
     */
    public static function webErrorStatuses(): array
    {
        return [400, 401, 403, 404, 405, 429, 500, 502, 503, 504];
    }
}
