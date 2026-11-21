<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateSiteSettingsRequest extends FormRequest
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
            'hero_headline' => ['required', 'string', 'max:220'],
            'hero_subheadline' => ['required', 'string', 'max:600'],
            'availability_status' => ['required', 'string', 'max:180'],
            'cv_pdf' => ['nullable', 'file', 'mimetypes:application/pdf', 'max:10240'],
        ];
    }
}
