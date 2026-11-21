<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class ErrorPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_404_renders_custom_inertia_error_page(): void
    {
        $this->get('/this-route-does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Error')
                ->where('status', 404)
                ->where('title', 'Route Not Found')
            );
    }

    public function test_403_renders_custom_inertia_error_page(): void
    {
        $nonOwner = User::factory()->create(['is_owner' => false]);

        $this->actingAs($nonOwner)
            ->get('/admin')
            ->assertForbidden()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Public/Error')
                ->where('status', 403)
                ->where('title', 'Access Restricted')
            );
    }

    public function test_standalone_blade_error_templates_compile_for_all_five_status_codes(): void
    {
        foreach ([
            403 => 'Access Restricted',
            404 => 'Route Not Found',
            500 => 'Internal Server Error',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
        ] as $code => $expectedTitle) {
            $html = view("errors.{$code}")->render();
            $this->assertStringContainsString((string) $code, $html);
            $this->assertStringContainsString($expectedTitle, $html);
        }
    }
}
