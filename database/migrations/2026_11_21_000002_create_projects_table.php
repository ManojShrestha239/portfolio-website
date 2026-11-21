<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category', 120);
            $table->boolean('is_flagship')->default(false)->index();
            $table->text('summary');
            $table->json('metrics_json');
            $table->json('tech_stack_json');
            $table->longText('body_markdown');
            $table->longText('body_html');
            $table->text('diagram_mermaid')->nullable();
            $table->string('preview_image_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
