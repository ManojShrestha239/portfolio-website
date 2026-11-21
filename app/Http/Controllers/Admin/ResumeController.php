<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\DeleteExperienceAction;
use App\Actions\Admin\DeleteSkillGroupAction;
use App\Actions\Admin\UpdateSiteSettingsAction;
use App\Actions\Admin\UpsertExperienceAction;
use App\Actions\Admin\UpsertSkillGroupAction;
use App\Data\ExperienceData;
use App\Data\SkillGroupData;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Http\Requests\Admin\UpsertExperienceRequest;
use App\Http\Requests\Admin\UpsertSkillGroupRequest;
use App\Models\Experience;
use App\Models\SkillGroup;
use App\Services\AdminQueryService;
use App\Services\PortfolioQueryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ResumeController
{
    public function __construct(
        private readonly AdminQueryService $adminQuery,
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Resume/Index', [
            'experiences' => array_map(
                static fn (ExperienceData $exp): array => $exp->toArray(),
                $this->adminQuery->getAllExperiences(),
            ),
            'skillGroups' => array_map(
                static fn (SkillGroupData $group): array => $group->toArray(),
                $this->adminQuery->getAllSkillGroups(),
            ),
            'siteSettings' => $this->portfolioQuery->getSiteSettings()->toArray(),
        ]);
    }

    public function storeExperience(UpsertExperienceRequest $request, UpsertExperienceAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('admin.resume.index')->with('success', 'Experience entry added.');
    }

    public function updateExperience(
        UpsertExperienceRequest $request,
        Experience $experience,
        UpsertExperienceAction $action,
    ): RedirectResponse {
        $action->execute($request->validated(), $experience);

        return redirect()->route('admin.resume.index')->with('success', 'Experience entry updated.');
    }

    public function destroyExperience(Experience $experience, DeleteExperienceAction $action): RedirectResponse
    {
        $action->execute($experience);

        return redirect()->route('admin.resume.index')->with('success', 'Experience entry deleted.');
    }

    public function storeSkillGroup(UpsertSkillGroupRequest $request, UpsertSkillGroupAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('admin.resume.index')->with('success', 'Skill group added.');
    }

    public function updateSkillGroup(
        UpsertSkillGroupRequest $request,
        SkillGroup $skillGroup,
        UpsertSkillGroupAction $action,
    ): RedirectResponse {
        $action->execute($request->validated(), $skillGroup);

        return redirect()->route('admin.resume.index')->with('success', 'Skill group updated.');
    }

    public function destroySkillGroup(SkillGroup $skillGroup, DeleteSkillGroupAction $action): RedirectResponse
    {
        $action->execute($skillGroup);

        return redirect()->route('admin.resume.index')->with('success', 'Skill group deleted.');
    }

    public function updateSettings(UpdateSiteSettingsRequest $request, UpdateSiteSettingsAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->file('cv_pdf'));

        return redirect()->route('admin.resume.index')->with('success', 'Site settings & CV updated.');
    }
}
