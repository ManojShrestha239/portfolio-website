<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\AdminAuditLog;
use Illuminate\Http\Request;

final class RecordAdminAuditLogAction
{
    /**
     * @param  array<string, mixed>|null  $metadata
     */
    public function execute(
        Request $request,
        string $action,
        ?string $targetType = null,
        string|int|null $targetId = null,
        ?array $metadata = null,
    ): void {
        AdminAuditLog::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId !== null ? (string) $targetId : null,
            'ip_hash' => hash('sha256', (string) ($request->ip() ?? 'unknown')),
            'user_agent' => substr((string) ($request->userAgent() ?? ''), 0, 250) ?: null,
            'metadata_json' => $metadata,
            'created_at' => now(),
        ]);
    }
}
