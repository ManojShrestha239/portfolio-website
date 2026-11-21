<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Services\PortfolioQueryService;
use DOMDocument;
use Illuminate\Http\Response;

final class SitemapController
{
    public function __construct(
        private readonly PortfolioQueryService $portfolioQuery,
    ) {}

    public function __invoke(): Response
    {
        $entries = [
            ['loc' => url('/'), 'priority' => '1.0', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/writing'), 'priority' => '0.9', 'lastmod' => now()->toAtomString()],
            ['loc' => url('/resume'), 'priority' => '0.8', 'lastmod' => now()->toAtomString()],
        ];

        foreach ($this->portfolioQuery->getPublishedProjects() as $project) {
            $entries[] = [
                'loc' => url("/work/{$project->slug}"),
                'priority' => $project->isFlagship ? '0.9' : '0.7',
                'lastmod' => $project->publishedAt ?? now()->toAtomString(),
            ];
        }

        foreach ($this->portfolioQuery->getPublishedArticles() as $article) {
            $entries[] = [
                'loc' => url("/writing/{$article->slug}"),
                'priority' => '0.8',
                'lastmod' => $article->publishedAt ?? now()->toAtomString(),
            ];
        }

        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;

        $namespace = implode('', ['http://', 'www.sitemaps.org/schemas/sitemap/0.9']);
        $urlset = $dom->createElementNS($namespace, 'urlset');
        $dom->appendChild($urlset);

        foreach ($entries as $entry) {
            $urlNode = $dom->createElement('url');
            $urlNode->appendChild($dom->createElement('loc', $entry['loc']));
            $urlNode->appendChild($dom->createElement('lastmod', $entry['lastmod']));
            $urlNode->appendChild($dom->createElement('priority', $entry['priority']));
            $urlset->appendChild($urlNode);
        }

        return response((string) $dom->saveXML(), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
