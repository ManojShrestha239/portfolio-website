<?php

declare(strict_types=1);

use App\Http\Controllers\Api\PortfolioApiController;
use App\Http\Controllers\Public\LocalWeatherController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware('throttle:api-public')
    ->name('api.v1.')
    ->group(function (): void {
        Route::get('/health', [PortfolioApiController::class, 'health'])->name('health');
        Route::get('/projects', [PortfolioApiController::class, 'projects'])->name('projects.index');
        Route::get('/projects/{slug}', [PortfolioApiController::class, 'showProject'])->name('projects.show');
        Route::get('/articles', [PortfolioApiController::class, 'articles'])->name('articles.index');
        Route::get('/articles/{slug}', [PortfolioApiController::class, 'showArticle'])->name('articles.show');
        Route::get('/resume', [PortfolioApiController::class, 'resume'])->name('resume');
        Route::get('/telemetry/weather', LocalWeatherController::class)->name('telemetry.weather');
    });
