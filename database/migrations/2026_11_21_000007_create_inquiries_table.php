<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 160);
            $table->string('email', 255);
            $table->string('company', 160)->nullable();
            $table->json('scope_tags_json');
            $table->text('message');
            $table->string('ip_hash', 64)->index();
            $table->string('status', 24)->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
