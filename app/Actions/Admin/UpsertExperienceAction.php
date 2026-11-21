<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Experience;

final class UpsertExperienceAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?Experience $experience = null): Experience
    {
        $attributes = [
            'role_title' => (string) $validated['role_title'],
            'organization' => (string) $validated['organization'],
            'period' => (string) $validated['period'],
            'highlights_json' => array_values((array) $validated['highlights']),
            'sort_order' => (int) $validated['sort_order'],
        ];

        if ($experience === null) {
            $experience = Experience::query()->create($attributes);
        } else {
            $experience->update($attributes);
        }

        $this->clearCache->execute(resume: true);

        return $experience->refresh();
    }
}
