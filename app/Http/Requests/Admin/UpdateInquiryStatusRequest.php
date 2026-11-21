<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateInquiryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_owner;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([
                    Inquiry::STATUS_NEW,
                    Inquiry::STATUS_IN_REVIEW,
                    Inquiry::STATUS_REPLIED,
                    Inquiry::STATUS_ARCHIVED,
                ]),
            ],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
