<?php

declare(strict_types=1);

namespace Tests\Feature;

use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class PublicPagesAndSeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_seeded_work_case_studies_render_and_unknown_slug_returns_404(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->get('/work/industrial-paint-formulation-dispensing-suite')
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Work/Show')
                ->where('project.slug', 'industrial-paint-formulation-dispensing-suite')
                ->has('relatedProjects', 3)
            );

        $this->get('/work/non-existent-case-study')->assertNotFound();
    }

    public function test_writing_index_supports_tag_filtering_and_article_detail_renders(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->get('/writing')
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Writing/Index')
                ->has('articles', 8)
                ->where('totalCount', 8)
            );

        $this->get('/writing?tag=Laravel')
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Writing/Index')
                ->where('activeTag', 'Laravel')
            );

        $this->get('/writing/zero-trust-saas-licensing-architecting-hmac-signed-gateways')
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Writing/Show')
                ->where('article.slug', 'zero-trust-saas-licensing-architecting-hmac-signed-gateways')
                ->has('relatedArticles', 3)
            );

        $this->get('/writing/missing-essay')->assertNotFound();
    }

    public function test_resume_and_dynamic_xml_sitemap_render_cleanly(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->get('/resume')
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Resume')
                ->has('resume.experiences', 2)
                ->has('resume.skillGroups', 4)
            );

        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertOk();
        $sitemap->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $sitemap->assertSee('/work/fieldma-enterprise-multi-tenant-saas', false);
        $sitemap->assertSee('/writing/early-return-migration-trap-multi-tenant-laravel', false);
        $sitemap->assertSee('/resume', false);
    }
}
