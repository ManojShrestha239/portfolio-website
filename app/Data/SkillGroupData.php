<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\SkillGroup;

final readonly class SkillGroupData
{
    /**
     * @param  list<string>  $skills
     */
    public function __construct(
        public int $id,
        public string $category,
        public array $skills,
        public int $sortOrder,
    ) {}

    public static function fromModel(SkillGroup $skillGroup): self
    {
        /** @var list<string> $skills */
        $skills = array_values(is_array($skillGroup->skills_json) ? $skillGroup->skills_json : []);

        return new self(
            id: (int) $skillGroup->id,
            category: (string) $skillGroup->category,
            skills: $skills,
            sortOrder: (int) $skillGroup->sort_order,
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<string> $skills */
        $skills = is_array($data['skills'] ?? null) ? array_values($data['skills']) : [];

        return new self(
            id: (int) ($data['id'] ?? 0),
            category: (string) ($data['category'] ?? ''),
            skills: $skills,
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
            'category' => $this->category,
            'skills' => $this->skills,
            'sortOrder' => $this->sortOrder,
        ];
    }
}
