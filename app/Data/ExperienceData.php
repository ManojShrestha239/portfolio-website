<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Experience;

final readonly class ExperienceData
{
    /**
     * @param  list<string>  $highlights
     */
    public function __construct(
        public int $id,
        public string $roleTitle,
        public string $organization,
        public string $period,
        public array $highlights,
        public int $sortOrder,
    ) {}

    public static function fromModel(Experience $experience): self
    {
        /** @var list<string> $highlights */
        $highlights = array_values(is_array($experience->highlights_json) ? $experience->highlights_json : []);

        return new self(
            id: (int) $experience->id,
            roleTitle: (string) $experience->role_title,
            organization: (string) $experience->organization,
            period: (string) $experience->period,
            highlights: $highlights,
            sortOrder: (int) $experience->sort_order,
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<string> $highlights */
        $highlights = is_array($data['highlights'] ?? null) ? array_values($data['highlights']) : [];

        return new self(
            id: (int) ($data['id'] ?? 0),
            roleTitle: (string) ($data['roleTitle'] ?? ''),
            organization: (string) ($data['organization'] ?? ''),
            period: (string) ($data['period'] ?? ''),
            highlights: $highlights,
            sortOrder: (int) ($data['sortOrder'] ?? 0),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'roleTitle' => $this->roleTitle,
            'organization' => $this->organization,
            'period' => $this->period,
            'highlights' => $this->highlights,
            'sortOrder' => $this->sortOrder,
        ];
    }
}
