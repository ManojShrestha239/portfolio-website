<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\SkillGroup;

final class UpsertSkillGroupAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?SkillGroup $skillGroup = null): SkillGroup
    {
        $attributes = [
            'category' => (string) $validated['category'],
            'skills_json' => array_values((array) $validated['skills']),
            'sort_order' => (int) $validated['sort_order'],
        ];

        if ($skillGroup === null) {
            $skillGroup = SkillGroup::query()->create($attributes);
        } else {
            $skillGroup->update($attributes);
        }

        $this->clearCache->execute(resume: true);

        return $skillGroup->refresh();
    }
}
