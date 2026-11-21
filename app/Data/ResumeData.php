<?php

declare(strict_types=1);

namespace App\Data;

final readonly class ResumeData
{
    /**
     * @param  list<ExperienceData>  $experiences
     * @param  list<SkillGroupData>  $skillGroups
     */
    public function __construct(
        public array $experiences,
        public array $skillGroups,
        public ?string $activeCvPath,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        $rawExperiences = is_array($data['experiences'] ?? null) ? $data['experiences'] : [];
        $rawSkillGroups = is_array($data['skillGroups'] ?? null) ? $data['skillGroups'] : [];

        return new self(
            experiences: array_values(array_map(
                static fn (array $item): ExperienceData => ExperienceData::fromArray($item),
                array_filter($rawExperiences, 'is_array'),
            )),
            skillGroups: array_values(array_map(
                static fn (array $item): SkillGroupData => SkillGroupData::fromArray($item),
                array_filter($rawSkillGroups, 'is_array'),
            )),
            activeCvPath: isset($data['activeCvPath']) && is_string($data['activeCvPath']) ? $data['activeCvPath'] : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'experiences' => array_map(
                static fn (ExperienceData $exp): array => $exp->toArray(),
                $this->experiences,
            ),
            'skillGroups' => array_map(
                static fn (SkillGroupData $group): array => $group->toArray(),
                $this->skillGroups,
            ),
            'activeCvPath' => $this->activeCvPath,
        ];
    }
}
