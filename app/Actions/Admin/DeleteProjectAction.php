<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Project;
use Illuminate\Support\Facades\Storage;

final class DeleteProjectAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    public function execute(Project $project): void
    {
        $slug = $project->slug;
        $previewPath = $project->preview_image_path;

        $project->delete();

        if ($previewPath !== null && Storage::disk('public')->exists($previewPath)) {
            Storage::disk('public')->delete($previewPath);
        }

        $this->clearCache->execute(projects: true, projectSlugs: [$slug]);
    }
}
