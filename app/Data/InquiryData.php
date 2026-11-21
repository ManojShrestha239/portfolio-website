<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Inquiry;

final readonly class InquiryData
{
    /**
     * @param  list<string>  $scopeTags
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $company,
        public array $scopeTags,
        public string $message,
        public string $status,
        public ?string $adminNotes,
        public ?string $createdAt,
    ) {}

    public static function fromModel(Inquiry $inquiry): self
    {
        /** @var list<string> $scopeTags */
        $scopeTags = array_values(is_array($inquiry->scope_tags_json) ? $inquiry->scope_tags_json : []);

        return new self(
            id: (int) $inquiry->id,
            name: (string) $inquiry->name,
            email: (string) $inquiry->email,
            company: $inquiry->company !== null ? (string) $inquiry->company : null,
            scopeTags: $scopeTags,
            message: (string) $inquiry->message,
            status: (string) $inquiry->status,
            adminNotes: $inquiry->admin_notes !== null ? (string) $inquiry->admin_notes : null,
            createdAt: $inquiry->created_at?->toIso8601String(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'company' => $this->company,
            'scopeTags' => $this->scopeTags,
            'message' => $this->message,
            'status' => $this->status,
            'adminNotes' => $this->adminNotes,
            'createdAt' => $this->createdAt,
        ];
    }
}
