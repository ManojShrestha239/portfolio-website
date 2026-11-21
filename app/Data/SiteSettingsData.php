<?php

declare(strict_types=1);

namespace App\Data;

final readonly class SiteSettingsData
{
    /**
     * @param  list<array{label: string, value: string, unit: string}>  $telemetry
     */
    public function __construct(
        public string $heroHeadline,
        public string $heroSubheadline,
        public string $availabilityStatus,
        public ?string $activeCvPath,
        public array $telemetry,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<array{label: string, value: string, unit: string}> $telemetry */
        $telemetry = is_array($data['telemetry'] ?? null) ? array_values($data['telemetry']) : [];

        return new self(
            heroHeadline: (string) ($data['heroHeadline'] ?? ''),
            heroSubheadline: (string) ($data['heroSubheadline'] ?? ''),
            availabilityStatus: (string) ($data['availabilityStatus'] ?? ''),
            activeCvPath: isset($data['activeCvPath']) && is_string($data['activeCvPath']) ? $data['activeCvPath'] : null,
            telemetry: $telemetry,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'heroHeadline' => $this->heroHeadline,
            'heroSubheadline' => $this->heroSubheadline,
            'availabilityStatus' => $this->availabilityStatus,
            'activeCvPath' => $this->activeCvPath,
            'telemetry' => $this->telemetry,
        ];
    }
}
