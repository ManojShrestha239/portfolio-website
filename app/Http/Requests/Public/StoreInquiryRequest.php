<?php

declare(strict_types=1);

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreInquiryRequest extends FormRequest
{
    public const ALLOWED_SCOPE_TAGS = [
        'Multi-Tenant SaaS',
        'Industrial Automation',
        'Security Audit',
        'Senior Engineering Role',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'company' => ['nullable', 'string', 'max:160'],
            'scope_tags' => ['required', 'array', 'min:1', 'max:4'],
            'scope_tags.*' => ['required', 'string', Rule::in(self::ALLOWED_SCOPE_TAGS)],
            'message' => ['required', 'string', 'min:15', 'max:4000'],
            // Honeypot trap: legitimate users leave this hidden field empty
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'scope_tags.required' => 'Select at least one engagement scope tag.',
            'scope_tags.min' => 'Select at least one engagement scope tag.',
            'website.max' => 'Automated submission rejected.',
        ];
    }
}
