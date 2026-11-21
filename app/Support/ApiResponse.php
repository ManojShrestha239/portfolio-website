<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ApiResponse
{
    /**
     * @param  array<string, mixed>|list<mixed>|null  $data
     * @param  array<string, mixed>  $meta
     */
    public static function ok(
        array|null $data = null,
        string $message = 'OK',
        int $status = 200,
        array $meta = [],
        ?Request $request = null,
    ): JsonResponse {
        $req = $request ?? request();

        return response()->json([
            'ok' => true,
            'status' => $status,
            'code' => $status === 201 ? 'CREATED' : ($status === 202 ? 'ACCEPTED' : 'OK'),
            'message' => $message,
            'data' => $data,
            'meta' => [
                'path' => '/'.ltrim($req->path(), '/'),
                'timestamp' => now()->toIso8601String(),
                ...$meta,
            ],
        ], $status);
    }

    /**
     * @param  array<string, list<string>>|null  $errors
     * @param  array<string, string>  $headers
     */
    public static function error(
        int $status,
        ?string $message = null,
        ?array $errors = null,
        ?Request $request = null,
        array $headers = [],
    ): JsonResponse {
        $req = $request ?? request();
        $meta = HttpStatusCatalog::describe($status);

        $payload = [
            'ok' => false,
            'status' => $meta['status'],
            'code' => $meta['code'],
            'title' => $meta['title'],
            'message' => ($message !== null && trim($message) !== '') ? $message : $meta['summary'],
            'meta' => [
                'path' => '/'.ltrim($req->path(), '/'),
                'timestamp' => now()->toIso8601String(),
            ],
        ];

        if ($errors !== null && $errors !== []) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $meta['status'], $headers);
    }
}
