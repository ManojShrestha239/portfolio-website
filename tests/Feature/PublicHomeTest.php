<?php

declare(strict_types=1);

namespace Tests\Feature;

use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class PublicHomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_inertia_public_home_with_seeded_dtos(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Public/Home')
            ->has('telemetry', 4)
            ->has('flagshipProjects', 4)
            ->has('secondaryProjects', 4)
            ->has('recentArticles', 4)
            ->where('app.owner', 'Manoj Shrestha')
        );
    }
}
