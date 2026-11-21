<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ResumeController as AdminResumeController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', HomeController::class)->name('home');

// Private Single-Owner Admin Auth (public registration strictly disabled)
Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:admin-login')
        ->name('login.store');

    Route::middleware(['auth', 'owner'])->group(function (): void {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        // Projects CRUD
        Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/create', [AdminProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('projects.edit');
        Route::post('/projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');

        // Articles CRUD
        Route::get('/articles', [AdminArticleController::class, 'index'])->name('articles.index');
        Route::get('/articles/create', [AdminArticleController::class, 'create'])->name('articles.create');
        Route::post('/articles', [AdminArticleController::class, 'store'])->name('articles.store');
        Route::get('/articles/{article}/edit', [AdminArticleController::class, 'edit'])->name('articles.edit');
        Route::put('/articles/{article}', [AdminArticleController::class, 'update'])->name('articles.update');
        Route::delete('/articles/{article}', [AdminArticleController::class, 'destroy'])->name('articles.destroy');

        // Resume, Skills & Site Settings / CV PDF
        Route::get('/resume', [AdminResumeController::class, 'index'])->name('resume.index');
        Route::post('/resume/experiences', [AdminResumeController::class, 'storeExperience'])->name('resume.experiences.store');
        Route::put('/resume/experiences/{experience}', [AdminResumeController::class, 'updateExperience'])->name('resume.experiences.update');
        Route::delete('/resume/experiences/{experience}', [AdminResumeController::class, 'destroyExperience'])->name('resume.experiences.destroy');
        Route::post('/resume/skills', [AdminResumeController::class, 'storeSkillGroup'])->name('resume.skills.store');
        Route::put('/resume/skills/{skillGroup}', [AdminResumeController::class, 'updateSkillGroup'])->name('resume.skills.update');
        Route::delete('/resume/skills/{skillGroup}', [AdminResumeController::class, 'destroySkillGroup'])->name('resume.skills.destroy');
        Route::post('/resume/settings', [AdminResumeController::class, 'updateSettings'])->name('resume.settings.update');

        // Inquiries & Scope Inbox
        Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
        Route::patch('/inquiries/{inquiry}', [AdminInquiryController::class, 'update'])->name('inquiries.update');
    });
});
