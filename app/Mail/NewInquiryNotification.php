<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class NewInquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Inquiry $inquiry,
    ) {}

    public function envelope(): Envelope
    {
        $company = $this->inquiry->company ? " ({$this->inquiry->company})" : '';

        return new Envelope(
            replyTo: [$this->inquiry->email],
            subject: "[Portfolio Scope] {$this->inquiry->name}{$company}",
        );
    }

    public function content(): Content
    {
        $tags = is_array($this->inquiry->scope_tags_json)
            ? implode(', ', $this->inquiry->scope_tags_json)
            : '';

        $body = implode("\n", [
            'New Project Scope Inquiry',
            '-------------------------',
            "Name: {$this->inquiry->name}",
            "Email: {$this->inquiry->email}",
            'Company: '.($this->inquiry->company ?? 'N/A'),
            "Scope Tags: {$tags}",
            '',
            'Message:',
            $this->inquiry->message,
            '',
            'Review in CMS: '.url('/admin/inquiries'),
        ]);

        return new Content(
            text: null,
            htmlString: nl2br(e($body)),
        );
    }
}
