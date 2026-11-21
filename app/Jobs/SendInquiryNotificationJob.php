<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\NewInquiryNotification;
use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

final class SendInquiryNotificationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 60];

    public function __construct(
        public readonly int $inquiryId,
    ) {
        $this->onQueue('notifications');
    }

    public function handle(): void
    {
        $inquiry = Inquiry::query()->find($this->inquiryId);
        if ($inquiry === null) {
            return;
        }

        $ownerEmail = User::query()
            ->where('is_owner', true)
            ->value('email');

        $recipient = is_string($ownerEmail) && $ownerEmail !== ''
            ? $ownerEmail
            : (string) config('mail.from.address', 'manoj@manojshrestha.dev');

        Mail::to($recipient)->send(new NewInquiryNotification($inquiry));
    }
}
