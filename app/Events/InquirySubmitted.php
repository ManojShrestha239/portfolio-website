<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Inquiry;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class InquirySubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $broadcastQueue = 'notifications';

    public function __construct(
        public readonly int $inquiryId,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $company,
        /** @var list<string> */
        public readonly array $scopeTags,
        public readonly string $status,
        public readonly string $createdAt,
    ) {}

    public static function fromModel(Inquiry $inquiry): self
    {
        /** @var list<string> $tags */
        $tags = array_values(is_array($inquiry->scope_tags_json) ? $inquiry->scope_tags_json : []);

        return new self(
            inquiryId: (int) $inquiry->id,
            name: (string) $inquiry->name,
            email: (string) $inquiry->email,
            company: $inquiry->company !== null ? (string) $inquiry->company : null,
            scopeTags: $tags,
            status: (string) $inquiry->status,
            createdAt: ($inquiry->created_at ?? now())->toIso8601String(),
        );
    }

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.inquiries'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'inquiry.submitted';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->inquiryId,
            'name' => $this->name,
            'email' => $this->email,
            'company' => $this->company,
            'scopeTags' => $this->scopeTags,
            'status' => $this->status,
            'createdAt' => $this->createdAt,
        ];
    }
}
