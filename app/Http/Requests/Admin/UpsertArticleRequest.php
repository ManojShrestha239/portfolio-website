<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\Article;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpsertArticleRequest extends FormRequest
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
        /** @var Article|null $article */
        $article = $this->route('article');

        return [
            'title' => ['required', 'string', 'max:220'],
            'slug' => [
                'required',
                'string',
                'max:220',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('articles', 'slug')->ignore($article?->id),
            ],
            'excerpt' => ['required', 'string', 'max:600'],
            'target_audience' => ['required', 'string', 'max:160'],
            'tags' => ['required', 'array', 'min:1', 'max:10'],
            'tags.*' => ['required', 'string', 'max:60'],
            'body_markdown' => ['required', 'string', 'max:100000'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
