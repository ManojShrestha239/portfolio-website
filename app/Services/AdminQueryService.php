<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\ArticleData;
use App\Data\ExperienceData;
use App\Data\InquiryData;
use App\Data\ProjectData;
use App\Data\SkillGroupData;
use App\Models\Article;
use App\Models\Experience;
use App\Models\Inquiry;
use App\Models\PageView;
use App\Models\Project;
use App\Models\SkillGroup;

final class AdminQueryService
{
    /**
     * @return array<string, mixed>
     */
    public function getDashboardStats(): array
    {
        return [
            'projectsTotal' => Project::query()->count(),
            'projectsPublished' => Project::query()->published()->count(),
            'projectsFlagship' => Project::query()->flagship()->count(),
            'articlesTotal' => Article::query()->count(),
            'articlesPublished' => Article::query()->published()->count(),
            'inquiriesNew' => Inquiry::query()->where('status', Inquiry::STATUS_NEW)->count(),
            'inquiriesTotal' => Inquiry::query()->count(),
            'pageViewsTotal' => (int) PageView::query()->sum('count'),
        ];
    }

    /**
     * @return list<InquiryData>
     */
    public function getRecentInquiries(int $limit = 5): array
    {
        return Inquiry::query()
            ->latest('id')
            ->limit($limit)
            ->get()
            ->map(static fn (Inquiry $inquiry): InquiryData => InquiryData::fromModel($inquiry))
            ->values()
            ->all();
    }

    /**
     * @return list<ProjectData>
     */
    public function getAllProjects(): array
    {
        return Project::query()
            ->ordered()
            ->get()
            ->map(static fn (Project $project): ProjectData => ProjectData::fromModel($project))
            ->values()
            ->all();
    }

    /**
     * @return list<ArticleData>
     */
    public function getAllArticles(): array
    {
        return Article::query()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(static fn (Article $article): ArticleData => ArticleData::fromModel($article))
            ->values()
            ->all();
    }

    /**
     * @return list<ExperienceData>
     */
    public function getAllExperiences(): array
    {
        return Experience::query()
            ->ordered()
            ->get()
            ->map(static fn (Experience $experience): ExperienceData => ExperienceData::fromModel($experience))
            ->values()
            ->all();
    }

    /**
     * @return list<SkillGroupData>
     */
    public function getAllSkillGroups(): array
    {
        return SkillGroup::query()
            ->ordered()
            ->get()
            ->map(static fn (SkillGroup $group): SkillGroupData => SkillGroupData::fromModel($group))
            ->values()
            ->all();
    }

    /**
     * @return list<InquiryData>
     */
    public function getInquiries(?string $status = null): array
    {
        $query = Inquiry::query()->latest('id');

        if ($status !== null && in_array($status, [
            Inquiry::STATUS_NEW,
            Inquiry::STATUS_IN_REVIEW,
            Inquiry::STATUS_REPLIED,
            Inquiry::STATUS_ARCHIVED,
        ], true)) {
            $query->where('status', $status);
        }

        return $query
            ->get()
            ->map(static fn (Inquiry $inquiry): InquiryData => InquiryData::fromModel($inquiry))
            ->values()
            ->all();
    }
}
