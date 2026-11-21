<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

final class OptimizeUploadedMediaJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly string $relativePath,
        public readonly string $disk = 'public',
    ) {
        $this->onQueue('media');
    }

    public function handle(): void
    {
        if (! Storage::disk($this->disk)->exists($this->relativePath)) {
            return;
        }

        if (! function_exists('imagecreatefromstring')) {
            return;
        }

        $absolutePath = Storage::disk($this->disk)->path($this->relativePath);
        $raw = @file_get_contents($absolutePath);
        if ($raw === false) {
            return;
        }

        $image = @imagecreatefromstring($raw);
        if ($image === false) {
            return;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $maxWidth = 1600;

        if ($width > $maxWidth && $height > 0) {
            $targetHeight = (int) round(($height / $width) * $maxWidth);
            $resized = imagecreatetruecolor($maxWidth, $targetHeight);
            if ($resized !== false) {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                imagecopyresampled($resized, $image, 0, 0, 0, 0, $maxWidth, $targetHeight, $width, $height);
                imagedestroy($image);
                $image = $resized;
            }
        }

        $ext = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));
        if ($ext === 'webp' && function_exists('imagewebp')) {
            imagewebp($image, $absolutePath, 82);
        } elseif ($ext === 'png') {
            imagesavealpha($image, true);
            imagepng($image, $absolutePath, 7);
        } elseif (in_array($ext, ['jpg', 'jpeg'], true)) {
            imagejpeg($image, $absolutePath, 84);
        }

        imagedestroy($image);
    }
}
