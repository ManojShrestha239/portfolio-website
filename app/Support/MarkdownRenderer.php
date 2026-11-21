<?php

declare(strict_types=1);

namespace App\Support;

use League\CommonMark\GithubFlavoredMarkdownConverter;

final class MarkdownRenderer
{
    private readonly GithubFlavoredMarkdownConverter $converter;

    public function __construct()
    {
        $this->converter = new GithubFlavoredMarkdownConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
            'max_nesting_level' => 25,
        ]);
    }

    public function toHtml(string $markdown): string
    {
        return (string) $this->converter->convert($markdown);
    }

    public function estimateReadingTimeMins(string $markdown): int
    {
        $wordCount = str_word_count(strip_tags($markdown));

        return max(1, (int) ceil($wordCount / 220));
    }
}
