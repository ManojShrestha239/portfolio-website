<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Experience;

final class DeleteExperienceAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    public function execute(Experience $experience): void
    {
        $experience->delete();
        $this->clearCache->execute(resume: true);
    }
}
