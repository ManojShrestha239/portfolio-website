<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class UpdateSiteSettingsAction
{
    public function __construct(
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?UploadedFile $cvPdf = null): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'hero'],
            [
                'value_json' => [
                    'headline' => (string) $validated['hero_headline'],
                    'subheadline' => (string) $validated['hero_subheadline'],
                    'availability_status' => (string) $validated['availability_status'],
                ],
            ],
        );

        if ($cvPdf !== null) {
            $existingSetting = SiteSetting::query()->where('key', 'cv')->first();
            $existingPath = is_array($existingSetting?->value_json)
                ? ($existingSetting->value_json['active_pdf_path'] ?? null)
                : null;

            $filename = 'cv-'.Str::uuid()->toString().'.pdf';
            $storedPath = $cvPdf->storeAs('cv', $filename, 'public');

            if (is_string($storedPath)) {
                if (is_string($existingPath) && Storage::disk('public')->exists($existingPath)) {
                    Storage::disk('public')->delete($existingPath);
                }

                SiteSetting::query()->updateOrCreate(
                    ['key' => 'cv'],
                    ['value_json' => ['active_pdf_path' => $storedPath]],
                );
            }
        }

        $this->clearCache->execute(resume: true, siteSettings: true);
    }
}
