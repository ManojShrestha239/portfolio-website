<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table): void {
            $table->id();
            $table->string('path', 255);
            $table->string('referrer_domain', 255)->nullable();
            $table->date('viewed_date');
            $table->unsignedInteger('count')->default(1);
            $table->timestamps();

            $table->unique(['path', 'viewed_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
