<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\RecordPageViewJob;
use App\Jobs\SendInquiryNotificationJob;
use App\Mail\NewInquiryNotification;
use App\Models\Inquiry;
use App\Models\PageView;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class InquiryAndTelemetryTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_renders_and_dispatches_page_view_job(): void
    {
        Queue::fake();
        $this->seed(PortfolioContentSeeder::class);

        $this->get('/contact')->assertOk();

        Queue::assertPushed(RecordPageViewJob::class, static function (RecordPageViewJob $job): bool {
            return $job->path === '/contact' && $job->queue === 'telemetry';
        });
    }

    public function test_submitting_inquiry_persists_to_database_and_dispatches_horizon_notification(): void
    {
        Queue::fake();
        $this->seed(PortfolioContentSeeder::class);

        $response = $this->from('/contact')->post('/inquiries', [
            'name' => 'Aarav Gurung',
            'email' => 'aarav@enterprise-example.com',
            'company' => 'Himalayan Industrial Corp',
            'scope_tags' => ['Multi-Tenant SaaS', 'Industrial Automation'],
            'message' => 'We need an architecture audit for a multi-tenant Laravel platform with serial hardware terminals.',
            'website' => '',
        ]);

        $response->assertRedirect('/contact');
        $response->assertSessionHas('success');

        $inquiry = Inquiry::query()->where('email', 'aarav@enterprise-example.com')->firstOrFail();
        $this->assertSame(Inquiry::STATUS_NEW, $inquiry->status);
        $this->assertSame(['Multi-Tenant SaaS', 'Industrial Automation'], $inquiry->scope_tags_json);
        $this->assertNotEmpty($inquiry->ip_hash);

        Queue::assertPushed(SendInquiryNotificationJob::class, static function (SendInquiryNotificationJob $job) use ($inquiry): bool {
            return $job->inquiryId === $inquiry->id && $job->queue === 'notifications';
        });

        // Verify the owner sees the submission inside /admin/inquiries
        $owner = User::query()->where('is_owner', true)->firstOrFail();
        $this->actingAs($owner)
            ->get('/admin/inquiries')
            ->assertOk()
            ->assertSee('Himalayan Industrial Corp');
    }

    public function test_honeypot_field_rejects_automated_spam_submissions(): void
    {
        Queue::fake();

        $this->from('/contact')->post('/inquiries', [
            'name' => 'Spam Bot',
            'email' => 'bot@spam.example',
            'scope_tags' => ['Security Audit'],
            'message' => 'Buy discounted SEO backlinks immediately.',
            'website' => 'https://spam-link.example',
        ])->assertSessionHasErrors('website');

        $this->assertDatabaseCount('inquiries', 0);
        Queue::assertNotPushed(SendInquiryNotificationJob::class);
    }

    public function test_send_inquiry_notification_job_delivers_email_to_owner(): void
    {
        Mail::fake();
        $this->seed(PortfolioContentSeeder::class);

        $inquiry = Inquiry::query()->create([
            'name' => 'Priya Sharma',
            'email' => 'priya@example.com',
            'company' => 'Kathmandu Cloud',
            'scope_tags_json' => ['Security Audit'],
            'message' => 'Requesting a 6-phase OWASP remediation review for our PHP backend.',
            'ip_hash' => hash('sha256', '10.0.0.1'),
            'status' => Inquiry::STATUS_NEW,
        ]);

        (new SendInquiryNotificationJob($inquiry->id))->handle();

        $owner = User::query()->where('is_owner', true)->firstOrFail();
        Mail::assertSent(NewInquiryNotification::class, static function (NewInquiryNotification $mail) use ($owner): bool {
            return $mail->hasTo($owner->email);
        });
    }

    public function test_record_page_view_job_aggregates_daily_counts_atomically(): void
    {
        $date = now()->toDateString();

        (new RecordPageViewJob('/work/fieldma-enterprise-multi-tenant-saas', 'github.com', $date))->handle();
        (new RecordPageViewJob('/work/fieldma-enterprise-multi-tenant-saas', 'github.com', $date))->handle();
        (new RecordPageViewJob('/work/fieldma-enterprise-multi-tenant-saas', null, $date))->handle();

        $this->assertDatabaseCount('page_views', 1);
        $record = PageView::query()->firstOrFail();
        $this->assertSame(3, $record->count);
    }
}
