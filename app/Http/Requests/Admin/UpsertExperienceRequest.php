<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class UpsertExperienceRequest extends FormRequest
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
            'role_title' => ['required', 'string', 'max:200'],
            'organization' => ['required', 'string', 'max:200'],
            'period' => ['required', 'string', 'max:100'],
            'highlights' => ['required', 'array', 'min:1', 'max:12'],
            'highlights.*' => ['required', 'string', 'max:600'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:999'],
        ];
    }
}
