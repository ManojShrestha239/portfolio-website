<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actions\Admin\ClearPortfolioCacheAction;
use App\Models\Article;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SkillGroup;
use App\Models\User;
use App\Services\PortfolioQueryService;
use App\Support\PortfolioCacheKeys;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

final class PortfolioCacheAndSeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_populates_all_verified_dossier_entities(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->assertSame(1, User::query()->where('is_owner', true)->count());
        $this->assertSame(4, Project::query()->flagship()->count());
        $this->assertSame(4, Project::query()->secondary()->count());
        $this->assertSame(8, Article::query()->published()->count());
        $this->assertSame(2, Experience::query()->count());
        $this->assertSame(4, SkillGroup::query()->count());
        $this->assertSame(3, SiteSetting::query()->count());
    }

    public function test_query_service_caches_reads_and_clear_action_invalidates_immediately(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);
        /** @var ClearPortfolioCacheAction $clearCache */
        $clearCache = app(ClearPortfolioCacheAction::class);

        $initialProjects = $query->getPublishedProjects();
        $this->assertCount(8, $initialProjects);
        $this->assertTrue(Cache::has(PortfolioCacheKeys::PROJECTS_PUBLISHED));

        $firstProject = Project::query()->where('slug', 'fieldma-enterprise-multi-tenant-saas')->firstOrFail();
        $cachedSlugDto = $query->findPublishedProjectBySlug($firstProject->slug);
        $this->assertNotNull($cachedSlugDto);
        $this->assertTrue(Cache::has(PortfolioCacheKeys::projectBySlug($firstProject->slug)));

        // Direct DB update stays cached until ClearPortfolioCacheAction is invoked
        $firstProject->update(['title' => 'FieldMA Enterprise Multi-Tenant SaaS v2']);
        $this->assertSame(
            'FieldMA Enterprise Multi-Tenant SaaS Evolution',
            $query->findPublishedProjectBySlug($firstProject->slug)?->title,
        );

        // Bust cache -> immediate reflection on next read
        $clearCache->execute(projects: true, projectSlugs: [$firstProject->slug]);
        $this->assertFalse(Cache::has(PortfolioCacheKeys::PROJECTS_PUBLISHED));
        $this->assertFalse(Cache::has(PortfolioCacheKeys::projectBySlug($firstProject->slug)));

        $this->assertSame(
            'FieldMA Enterprise Multi-Tenant SaaS v2',
            $query->findPublishedProjectBySlug($firstProject->slug)?->title,
        );
    }

    public function test_resume_and_articles_caching_and_invalidation(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);
        /** @var ClearPortfolioCacheAction $clearCache */
        $clearCache = app(ClearPortfolioCacheAction::class);

        $resume = $query->getResumeData();
        $this->assertCount(2, $resume->experiences);
        $this->assertCount(4, $resume->skillGroups);
        $this->assertTrue(Cache::has(PortfolioCacheKeys::RESUME));

        $articles = $query->getPublishedArticles();
        $this->assertCount(8, $articles);
        $this->assertTrue(Cache::has(PortfolioCacheKeys::ARTICLES_PUBLISHED));

        $clearCache->execute(articles: true, resume: true);
        $this->assertFalse(Cache::has(PortfolioCacheKeys::RESUME));
        $this->assertFalse(Cache::has(PortfolioCacheKeys::ARTICLES_PUBLISHED));
    }

    public function test_cached_payloads_are_plain_arrays_safe_for_strict_unserialization(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);

        $query->getSiteSettings();
        $query->getPublishedProjects();
        $query->getPublishedArticles();
        $query->getResumeData();

        foreach ([
            PortfolioCacheKeys::SITE_SETTINGS,
            PortfolioCacheKeys::PROJECTS_PUBLISHED,
            PortfolioCacheKeys::ARTICLES_PUBLISHED,
            PortfolioCacheKeys::RESUME,
        ] as $key) {
            $raw = Cache::get($key);
            $this->assertIsArray($raw);

            $roundTripped = unserialize(serialize($raw), ['allowed_classes' => false]);
            $this->assertSame($raw, $roundTripped);
        }
    }
}
