<?php

declare(strict_types=1);

namespace App\Actions\Public;

use App\Jobs\SendInquiryNotificationJob;
use App\Models\Inquiry;

final class SubmitInquiryAction
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?string $ipAddress): Inquiry
    {
        $inquiry = Inquiry::query()->create([
            'name' => (string) $validated['name'],
            'email' => (string) $validated['email'],
            'company' => isset($validated['company']) && trim((string) $validated['company']) !== ''
                ? trim((string) $validated['company'])
                : null,
            'scope_tags_json' => array_values((array) $validated['scope_tags']),
            'message' => trim((string) $validated['message']),
            'ip_hash' => hash('sha256', (string) ($ipAddress ?? 'unknown')),
            'status' => Inquiry::STATUS_NEW,
        ]);

        SendInquiryNotificationJob::dispatch($inquiry->id);

        return $inquiry;
    }
}
