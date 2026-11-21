<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\SkillGroup;

final class DeleteSkillGroupAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    public function execute(SkillGroup $skillGroup): void
    {
        $skillGroup->delete();
        $this->clearCache->execute(resume: true);
    }
}
