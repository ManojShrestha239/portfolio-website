<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\DeleteProjectAction;
use App\Actions\Admin\UpsertProjectAction;
use App\Data\ProjectData;
use App\Http\Requests\Admin\UpsertProjectRequest;
use App\Models\Project;
use App\Services\AdminQueryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectController
{
    public function __construct(
        private readonly AdminQueryService $adminQuery,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => array_map(
                static fn (ProjectData $project): array => $project->toArray(),
                $this->adminQuery->getAllProjects(),
            ),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
        ]);
    }

    public function store(UpsertProjectRequest $request, UpsertProjectAction $action): RedirectResponse
    {
        $action->execute(
            validated: $request->validated(),
            project: null,
            previewImage: $request->file('preview_image'),
        );

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project created and portfolio cache invalidated.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => ProjectData::fromModel($project)->toArray(),
        ]);
    }

    public function update(
        UpsertProjectRequest $request,
        Project $project,
        UpsertProjectAction $action,
    ): RedirectResponse {
        $action->execute(
            validated: $request->validated(),
            project: $project,
            previewImage: $request->file('preview_image'),
        );

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project updated and portfolio cache invalidated.');
    }

    public function destroy(Project $project, DeleteProjectAction $action): RedirectResponse
    {
        $action->execute($project);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted and portfolio cache invalidated.');
    }
}
