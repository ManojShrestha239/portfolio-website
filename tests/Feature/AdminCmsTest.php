<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\OptimizeUploadedMediaJob;
use App\Models\Article;
use App\Models\Inquiry;
use App\Models\Project;
use App\Models\User;
use App\Services\PortfolioQueryService;
use App\Support\PortfolioCacheKeys;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class AdminCmsTest extends TestCase
{
    use RefreshDatabase;

    private function createOwner(): User
    {
        return User::factory()->create([
            'name' => 'Manoj Shrestha',
            'email' => 'owner@manojshrestha.dev',
            'password' => 'SuperSecretPassword!2026',
            'is_owner' => true,
        ]);
    }

    public function test_public_registration_route_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_guests_are_redirected_to_admin_login_and_non_owners_receive_403(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');

        $regularUser = User::factory()->create(['is_owner' => false]);
        $this->actingAs($regularUser)->get('/admin')->assertForbidden();
    }

    public function test_owner_can_sign_in_and_access_dashboard(): void
    {
        $owner = $this->createOwner();

        $this->post('/admin/login', [
            'email' => $owner->email,
            'password' => 'SuperSecretPassword!2026',
        ])->assertRedirect('/admin');

        $this->assertAuthenticatedAs($owner);
        $this->get('/admin')->assertOk();
    }

    public function test_creating_project_with_image_dispatches_horizon_job_and_busts_cache(): void
    {
        Storage::fake('public');
        Queue::fake();

        $this->seed(PortfolioContentSeeder::class);
        $owner = $this->createOwner();

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);
        $query->getPublishedProjects();
        $this->assertTrue(Cache::has(PortfolioCacheKeys::PROJECTS_PUBLISHED));

        $response = $this->actingAs($owner)->post('/admin/projects', [
            'title' => 'Industrial Telemetry Relay',
            'slug' => 'industrial-telemetry-relay',
            'category' => 'Industrial Automation',
            'is_flagship' => true,
            'summary' => 'Deterministic serial telemetry relay for factory dispensing lines.',
            'metrics' => [
                ['label' => 'Latency', 'value' => '<10ms', 'unit' => 'Serial Roundtrip'],
            ],
            'tech_stack' => ['Laravel 13', 'Redis', 'RS-232'],
            'body_markdown' => '## Architecture\n\nDeterministic serial frame dispatch.',
            'diagram_mermaid' => 'flowchart LR\nA-->B',
            'preview_image' => UploadedFile::fake()->image('diagram.png', 1200, 800),
            'sort_order' => 10,
            'is_published' => true,
        ]);

        $response->assertRedirect('/admin/projects');
        $this->assertFalse(Cache::has(PortfolioCacheKeys::PROJECTS_PUBLISHED));

        $project = Project::query()->where('slug', 'industrial-telemetry-relay')->firstOrFail();
        $this->assertNotNull($project->preview_image_path);
        Storage::disk('public')->assertExists($project->preview_image_path);

        Queue::assertPushed(OptimizeUploadedMediaJob::class, static function (OptimizeUploadedMediaJob $job) use ($project): bool {
            return $job->relativePath === $project->preview_image_path && $job->queue === 'media';
        });
    }

    public function test_article_crud_invalidates_cache_immediately(): void
    {
        $this->seed(PortfolioContentSeeder::class);
        $owner = $this->createOwner();

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);
        $query->getPublishedArticles();
        $this->assertTrue(Cache::has(PortfolioCacheKeys::ARTICLES_PUBLISHED));

        $this->actingAs($owner)->post('/admin/articles', [
            'title' => 'Deterministic Queue Isolation in Laravel Horizon',
            'slug' => 'deterministic-queue-isolation-laravel-horizon',
            'excerpt' => 'Separating latency-sensitive notifications from CPU-bound image processing.',
            'target_audience' => 'Backend Engineers',
            'tags' => ['Laravel Horizon', 'Redis'],
            'body_markdown' => '## Queue Segregation\n\nIsolate media workers from transactional mail.',
            'is_published' => true,
        ])->assertRedirect('/admin/articles');

        $this->assertFalse(Cache::has(PortfolioCacheKeys::ARTICLES_PUBLISHED));
        $article = Article::query()->where('slug', 'deterministic-queue-isolation-laravel-horizon')->firstOrFail();

        $this->actingAs($owner)->delete("/admin/articles/{$article->id}")->assertRedirect('/admin/articles');
        $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    }

    public function test_owner_can_upload_cv_pdf_and_update_inquiry_status(): void
    {
        Storage::fake('public');
        $this->seed(PortfolioContentSeeder::class);
        $owner = $this->createOwner();

        $this->actingAs($owner)->post('/admin/resume/settings', [
            'hero_headline' => 'Enterprise SaaS & Industrial Systems Architecture.',
            'hero_subheadline' => 'Updated dynamic subheadline.',
            'availability_status' => 'Open for Principal Architecture Engagements',
            'cv_pdf' => UploadedFile::fake()->create('manoj-cv.pdf', 120, 'application/pdf'),
        ])->assertRedirect('/admin/resume');

        /** @var PortfolioQueryService $query */
        $query = app(PortfolioQueryService::class);
        $settings = $query->getSiteSettings();
        $this->assertNotNull($settings->activeCvPath);
        Storage::disk('public')->assertExists($settings->activeCvPath);

        $inquiry = Inquiry::query()->create([
            'name' => 'CTO Example',
            'email' => 'cto@example.com',
            'company' => 'Acme Industrial',
            'scope_tags_json' => ['Multi-Tenant SaaS'],
            'message' => 'Interested in a tenancy architecture review.',
            'ip_hash' => hash('sha256', '127.0.0.1'),
            'status' => Inquiry::STATUS_NEW,
        ]);

        $this->actingAs($owner)->patch("/admin/inquiries/{$inquiry->id}", [
            'status' => Inquiry::STATUS_REPLIED,
            'admin_notes' => 'Scheduled architecture scoping call.',
        ])->assertRedirect('/admin/inquiries');

        $inquiry->refresh();
        $this->assertSame(Inquiry::STATUS_REPLIED, $inquiry->status);
        $this->assertSame('Scheduled architecture scoping call.', $inquiry->admin_notes);
    }
}
