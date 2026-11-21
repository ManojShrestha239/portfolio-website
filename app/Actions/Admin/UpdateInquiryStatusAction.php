<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\Inquiry;

final class UpdateInquiryStatusAction
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(Inquiry $inquiry, array $validated): Inquiry
    {
        $inquiry->update([
            'status' => (string) $validated['status'],
            'admin_notes' => isset($validated['admin_notes']) && trim((string) $validated['admin_notes']) !== ''
                ? (string) $validated['admin_notes']
                : null,
        ]);

        return $inquiry->refresh();
    }
}
