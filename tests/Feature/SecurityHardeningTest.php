<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\AdminAuditLog;
use App\Models\User;
use App\Support\MarkdownRenderer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_and_api_responses_include_strict_security_headers(): void
    {
        foreach (['/', '/api/v1/health'] as $path) {
            $response = $this->get($path);
            $response->assertOk();
            $response->assertHeader('X-Frame-Options', 'DENY');
            $response->assertHeader('X-Content-Type-Options', 'nosniff');
            $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin');
            $response->assertHeader('Cross-Origin-Resource-Policy', 'same-origin');
            $this->assertNotEmpty($response->headers->get('Content-Security-Policy'));
            $this->assertNotEmpty($response->headers->get('Permissions-Policy'));
            $this->assertNull($response->headers->get('X-Powered-By'));
        }
    }

    public function test_admin_routes_enforce_no_store_cache_and_noindex_robots_headers(): void
    {
        $response = $this->get('/admin/login');
        $response->assertOk();
        $response->assertHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
    }

    public function test_admin_auth_events_are_recorded_in_audit_log_with_hashed_ip(): void
    {
        $owner = User::factory()->create([
            'email' => 'owner@manojshrestha.dev',
            'password' => 'StrongPassphrase!2026',
            'is_owner' => true,
        ]);

        // Failed login attempt
        $this->post('/admin/login', [
            'email' => $owner->email,
            'password' => 'WrongPassword!123',
        ])->assertSessionHasErrors('email');

        // Successful login + logout
        $this->post('/admin/login', [
            'email' => $owner->email,
            'password' => 'StrongPassphrase!2026',
        ])->assertRedirect('/admin');

        $this->post('/admin/logout')->assertRedirect('/admin/login');

        $actions = AdminAuditLog::query()->orderBy('id')->pluck('action')->all();
        $this->assertSame(['login_failed', 'login_success', 'logout'], $actions);

        $firstLog = AdminAuditLog::query()->firstOrFail();
        $this->assertSame(64, strlen($firstLog->ip_hash));
    }

    public function test_api_endpoints_expose_rate_limit_headers(): void
    {
        $response = $this->getJson('/api/v1/health');
        $response->assertOk();
        $response->assertHeader('X-RateLimit-Limit', '60');
    }

    public function test_markdown_renderer_strips_raw_scripts_and_javascript_urls(): void
    {
        $renderer = new MarkdownRenderer();
        $html = $renderer->toHtml("Safe text <script>alert('xss')</script> [click](javascript:alert(1))");

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringNotContainsString('javascript:', $html);
    }

    public function test_robots_txt_disallows_admin_and_horizon(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));
        $this->assertIsString($robots);
        $this->assertStringContainsString('Disallow: /admin', $robots);
        $this->assertStringContainsString('Disallow: /horizon', $robots);
    }
}
