<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ApiResponseContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_v1_success_endpoints_return_uniform_ok_envelope(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertJsonStructure(['ok', 'status', 'code', 'message', 'data', 'meta' => ['path', 'timestamp']])
            ->assertJson([
                'ok' => true,
                'status' => 200,
                'code' => 'OK',
                'data' => ['status' => 'healthy'],
            ]);

        $this->getJson('/api/v1/projects')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'status' => 200,
                'code' => 'OK',
                'meta' => ['count' => 8],
            ]);

        $this->getJson('/api/v1/articles')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'status' => 200,
                'code' => 'OK',
                'meta' => ['count' => 8],
            ]);

        $this->getJson('/api/v1/resume')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'status' => 200,
                'code' => 'OK',
            ]);
    }

    public function test_api_404_and_405_return_uniform_error_envelope(): void
    {
        $this->getJson('/api/v1/projects/non-existent-slug')
            ->assertNotFound()
            ->assertJsonStructure(['ok', 'status', 'code', 'title', 'message', 'meta' => ['path', 'timestamp']])
            ->assertJson([
                'ok' => false,
                'status' => 404,
                'code' => 'RESOURCE_NOT_FOUND',
                'title' => 'Route Not Found',
            ]);

        $this->getJson('/api/v1/unknown-endpoint')
            ->assertNotFound()
            ->assertJson([
                'ok' => false,
                'status' => 404,
                'code' => 'RESOURCE_NOT_FOUND',
            ]);

        $this->postJson('/api/v1/health')
            ->assertStatus(405)
            ->assertJson([
                'ok' => false,
                'status' => 405,
                'code' => 'METHOD_NOT_ALLOWED',
                'title' => 'Method Not Allowed',
            ]);
    }

    public function test_json_403_and_422_return_uniform_error_envelope(): void
    {
        $nonOwner = User::factory()->create(['is_owner' => false]);

        $this->actingAs($nonOwner)
            ->getJson('/admin')
            ->assertForbidden()
            ->assertJson([
                'ok' => false,
                'status' => 403,
                'code' => 'AUTH_POLICY_DENIED',
                'title' => 'Access Restricted',
            ]);

        $this->postJson('/inquiries', [
            'name' => '',
            'email' => 'not-an-email',
            'scope_tags' => [],
            'message' => 'short',
        ])
            ->assertUnprocessable()
            ->assertJsonStructure(['ok', 'status', 'code', 'title', 'message', 'errors', 'meta'])
            ->assertJson([
                'ok' => false,
                'status' => 422,
                'code' => 'VALIDATION_FAILED',
                'title' => 'Validation Failed',
            ]);
    }
}
