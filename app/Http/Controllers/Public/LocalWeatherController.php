<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

final class LocalWeatherController
{
    private const CACHE_KEY = 'portfolio:telemetry:weather:nepal';

    private const TTL_SECONDS = 900;

    public function __invoke(): JsonResponse
    {
        $payload = Cache::remember(
            self::CACHE_KEY,
            self::TTL_SECONDS,
            static function (): array {
                $endpoint = (string) env(
                    'WEATHER_API_URL',
                    'https://'.'api.open-meteo.com/v1/forecast',
                );

                try {
                    $response = Http::timeout(4)
                        ->acceptJson()
                        ->get($endpoint, [
                            'latitude' => (float) env('WEATHER_LATITUDE', 27.6833),
                            'longitude' => (float) env('WEATHER_LONGITUDE', 84.4333),
                            'current' => 'temperature_2m,weather_code,is_day',
                            'timezone' => 'Asia/Kathmandu',
                        ]);

                    if (! $response->successful()) {
                        return self::unavailablePayload();
                    }

                    $current = $response->json('current');
                    if (! is_array($current) || ! isset($current['temperature_2m'])) {
                        return self::unavailablePayload();
                    }

                    $code = (int) ($current['weather_code'] ?? 0);
                    $isDay = (int) ($current['is_day'] ?? 1) === 1;
                    [$condition, $icon] = self::describeWmoCode($code, $isDay);

                    return [
                        'available' => true,
                        'location' => (string) env('WEATHER_LOCATION_LABEL', 'Bharatpur, NP'),
                        'temperatureC' => (int) round((float) $current['temperature_2m']),
                        'condition' => $condition,
                        'icon' => $icon,
                        'isDay' => $isDay,
                    ];
                } catch (Throwable) {
                    return self::unavailablePayload();
                }
            },
        );

        return response()->json($payload);
    }

    /**
     * @return array{available: false, location: string, temperatureC: null, condition: string, icon: string, isDay: bool}
     */
    private static function unavailablePayload(): array
    {
        return [
            'available' => false,
            'location' => (string) env('WEATHER_LOCATION_LABEL', 'Bharatpur, NP'),
            'temperatureC' => null,
            'condition' => 'Unavailable',
            'icon' => 'cloud',
            'isDay' => true,
        ];
    }

    /**
     * @return array{0: string, 1: string}
     */
    private static function describeWmoCode(int $code, bool $isDay): array
    {
        return match (true) {
            $code === 0 => ['Clear', $isDay ? 'sun' : 'moon'],
            $code >= 1 && $code <= 3 => ['Partly Cloudy', 'cloud'],
            $code === 45 || $code === 48 => ['Fog', 'fog'],
            ($code >= 51 && $code <= 67) || ($code >= 80 && $code <= 82) => ['Rain', 'rain'],
            $code >= 71 && $code <= 77 => ['Snow', 'cloud'],
            $code >= 95 => ['Storm', 'storm'],
            default => ['Clear', $isDay ? 'sun' : 'moon'],
        };
    }
}
