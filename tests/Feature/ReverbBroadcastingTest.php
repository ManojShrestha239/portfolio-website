<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actions\Admin\ClearPortfolioCacheAction;
use App\Events\InquirySubmitted;
use App\Events\PortfolioContentUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class ReverbBroadcastingTest extends TestCase
{
    use RefreshDatabase;

    public function test_submitting_inquiry_broadcasts_inquiry_submitted_on_private_admin_channel(): void
    {
        Event::fake([InquirySubmitted::class]);
        Queue::fake();

        $this->from('/contact')->post('/inquiries', [
            'name' => 'Kiran Adhikari',
            'email' => 'kiran@enterprise.example',
            'company' => 'Everest Systems',
            'scope_tags' => ['Multi-Tenant SaaS'],
            'message' => 'Evaluating a database-per-tenant Laravel 13 architecture migration.',
            'website' => '',
        ])->assertRedirect('/contact');

        Event::assertDispatched(InquirySubmitted::class, static function (InquirySubmitted $event): bool {
            $channels = $event->broadcastOn();

            return $event->name === 'Kiran Adhikari'
                && $event->broadcastAs() === 'inquiry.submitted'
                && count($channels) === 1
                && $channels[0]->name === 'private-admin.inquiries';
        });
    }

    public function test_clearing_portfolio_cache_broadcasts_portfolio_content_updated_event(): void
    {
        Event::fake([PortfolioContentUpdated::class]);

        /** @var ClearPortfolioCacheAction $clearCache */
        $clearCache = app(ClearPortfolioCacheAction::class);
        $clearCache->execute(projects: true);

        Event::assertDispatched(PortfolioContentUpdated::class, static function (PortfolioContentUpdated $event): bool {
            $channels = $event->broadcastOn();

            return $event->scope === 'projects'
                && $event->broadcastAs() === 'content.updated'
                && count($channels) === 1
                && $channels[0]->name === 'portfolio.telemetry';
        });
    }

    public function test_security_headers_csp_permits_reverb_websocket_origin(): void
    {
        $response = $this->get('/');
        $csp = (string) $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString('connect-src', $csp);
        $this->assertStringContainsString('ws://localhost:8080', $csp);
    }
}
