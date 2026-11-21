<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpsertProjectRequest extends FormRequest
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
        /** @var Project|null $project */
        $project = $this->route('project');

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => [
                'required',
                'string',
                'max:200',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'category' => ['required', 'string', 'max:120'],
            'is_flagship' => ['required', 'boolean'],
            'summary' => ['required', 'string', 'max:1000'],
            'metrics' => ['required', 'array', 'min:1', 'max:8'],
            'metrics.*.label' => ['required', 'string', 'max:80'],
            'metrics.*.value' => ['required', 'string', 'max:60'],
            'metrics.*.unit' => ['nullable', 'string', 'max:80'],
            'tech_stack' => ['required', 'array', 'min:1', 'max:20'],
            'tech_stack.*' => ['required', 'string', 'max:80'],
            'body_markdown' => ['required', 'string', 'max:65000'],
            'diagram_mermaid' => ['nullable', 'string', 'max:16000'],
            'preview_image' => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:5120'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:999'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
