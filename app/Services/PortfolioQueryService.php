<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\ArticleData;
use App\Data\ExperienceData;
use App\Data\ProjectData;
use App\Data\ResumeData;
use App\Data\SiteSettingsData;
use App\Data\SkillGroupData;
use App\Models\Article;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SkillGroup;
use App\Support\PortfolioCacheKeys;
use Illuminate\Support\Facades\Cache;

final class PortfolioQueryService
{
    /**
     * @return list<ProjectData>
     */
    public function getPublishedProjects(): array
    {
        $cached = Cache::remember(
            PortfolioCacheKeys::PROJECTS_PUBLISHED,
            PortfolioCacheKeys::TTL_SECONDS,
            static fn (): array => Project::query()
                ->published()
                ->ordered()
                ->get()
                ->map(static fn (Project $project): array => ProjectData::fromModel($project)->toArray())
                ->values()
                ->all(),
        );

        if (! is_array($cached)) {
            Cache::forget(PortfolioCacheKeys::PROJECTS_PUBLISHED);

            return $this->getPublishedProjects();
        }

        return array_values(array_map(
            static fn (array $item): ProjectData => ProjectData::fromArray($item),
            array_filter($cached, 'is_array'),
        ));
    }

    /**
     * @return list<ProjectData>
     */
    public function getFlagshipProjects(): array
    {
        return array_values(array_filter(
            $this->getPublishedProjects(),
            static fn (ProjectData $project): bool => $project->isFlagship,
        ));
    }

    /**
     * @return list<ProjectData>
     */
    public function getSecondaryProjects(): array
    {
        return array_values(array_filter(
            $this->getPublishedProjects(),
            static fn (ProjectData $project): bool => ! $project->isFlagship,
        ));
    }

    public function findPublishedProjectBySlug(string $slug): ?ProjectData
    {
        $key = PortfolioCacheKeys::projectBySlug($slug);

        $cached = Cache::remember(
            $key,
            PortfolioCacheKeys::TTL_SECONDS,
            static function () use ($slug): ?array {
                $model = Project::query()
                    ->published()
                    ->where('slug', $slug)
                    ->first();

                return $model !== null ? ProjectData::fromModel($model)->toArray() : null;
            },
        );

        if ($cached === null) {
            return null;
        }

        if (! is_array($cached)) {
            Cache::forget($key);

            return $this->findPublishedProjectBySlug($slug);
        }

        return ProjectData::fromArray($cached);
    }

    /**
     * @return list<ArticleData>
     */
    public function getPublishedArticles(): array
    {
        $cached = Cache::remember(
            PortfolioCacheKeys::ARTICLES_PUBLISHED,
            PortfolioCacheKeys::TTL_SECONDS,
            static fn (): array => Article::query()
                ->published()
                ->latestPublished()
                ->get()
                ->map(static fn (Article $article): array => ArticleData::fromModel($article)->toArray())
                ->values()
                ->all(),
        );

        if (! is_array($cached)) {
            Cache::forget(PortfolioCacheKeys::ARTICLES_PUBLISHED);

            return $this->getPublishedArticles();
        }

        return array_values(array_map(
            static fn (array $item): ArticleData => ArticleData::fromArray($item),
            array_filter($cached, 'is_array'),
        ));
    }

    public function findPublishedArticleBySlug(string $slug): ?ArticleData
    {
        $key = PortfolioCacheKeys::articleBySlug($slug);

        $cached = Cache::remember(
            $key,
            PortfolioCacheKeys::TTL_SECONDS,
            static function () use ($slug): ?array {
                $model = Article::query()
                    ->published()
                    ->where('slug', $slug)
                    ->first();

                return $model !== null ? ArticleData::fromModel($model)->toArray() : null;
            },
        );

        if ($cached === null) {
            return null;
        }

        if (! is_array($cached)) {
            Cache::forget($key);

            return $this->findPublishedArticleBySlug($slug);
        }

        return ArticleData::fromArray($cached);
    }

    public function getResumeData(): ResumeData
    {
        $cached = Cache::remember(
            PortfolioCacheKeys::RESUME,
            PortfolioCacheKeys::TTL_SECONDS,
            function (): array {
                $experiences = Experience::query()
                    ->ordered()
                    ->get()
                    ->map(static fn (Experience $exp): ExperienceData => ExperienceData::fromModel($exp))
                    ->values()
                    ->all();

                $skillGroups = SkillGroup::query()
                    ->ordered()
                    ->get()
                    ->map(static fn (SkillGroup $group): SkillGroupData => SkillGroupData::fromModel($group))
                    ->values()
                    ->all();

                $settings = $this->getSiteSettings();

                return (new ResumeData(
                    experiences: $experiences,
                    skillGroups: $skillGroups,
                    activeCvPath: $settings->activeCvPath,
                ))->toArray();
            },
        );

        if (! is_array($cached)) {
            Cache::forget(PortfolioCacheKeys::RESUME);

            return $this->getResumeData();
        }

        return ResumeData::fromArray($cached);
    }

    public function getSiteSettings(): SiteSettingsData
    {
        $cached = Cache::remember(
            PortfolioCacheKeys::SITE_SETTINGS,
            PortfolioCacheKeys::TTL_SECONDS,
            static function (): array {
                /** @var array<string, array<string, mixed>> $map */
                $map = SiteSetting::query()
                    ->get()
                    ->keyBy('key')
                    ->map(static fn (SiteSetting $setting): array => is_array($setting->value_json) ? $setting->value_json : [])
                    ->all();

                $hero = $map['hero'] ?? [];
                $cv = $map['cv'] ?? [];

                /** @var list<array{label: string, value: string, unit: string}> $telemetry */
                $telemetry = isset($map['telemetry']['items']) && is_array($map['telemetry']['items'])
                    ? array_values($map['telemetry']['items'])
                    : [
                        ['label' => 'Enterprise Paint Brands', 'value' => '10', 'unit' => 'Deployed'],
                        ['label' => 'Retail Dealer Terminals', 'value' => '500+', 'unit' => 'Active'],
                        ['label' => 'ETL Runtime Reduction', 'value' => '95%', 'unit' => '<45s / 64MB'],
                        ['label' => 'Mobile API Reduction', 'value' => '51%', 'unit' => '80 -> 39 Routes'],
                    ];

                return (new SiteSettingsData(
                    heroHeadline: is_string($hero['headline'] ?? null)
                        ? $hero['headline']
                        : 'Enterprise SaaS & Industrial Systems Architecture.',
                    heroSubheadline: is_string($hero['subheadline'] ?? null)
                        ? $hero['subheadline']
                        : 'Manoj Shrestha engineers high-throughput Laravel multi-tenant platforms, streaming ETL pipelines, and RS-232 hardware-to-web automation deployed across 500+ industrial terminals.',
                    availabilityStatus: is_string($hero['availability_status'] ?? null)
                        ? $hero['availability_status']
                        : 'Available for Principal/Staff Engineering & Enterprise Architecture',
                    activeCvPath: is_string($cv['active_pdf_path'] ?? null)
                        ? $cv['active_pdf_path']
                        : null,
                    telemetry: $telemetry,
                ))->toArray();
            },
        );

        if (! is_array($cached)) {
            Cache::forget(PortfolioCacheKeys::SITE_SETTINGS);

            return $this->getSiteSettings();
        }

        return SiteSettingsData::fromArray($cached);
    }
}
