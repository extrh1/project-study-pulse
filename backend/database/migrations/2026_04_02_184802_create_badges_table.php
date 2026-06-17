<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();

            // badge info
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();

            // gamification rules
            $table->integer('required_xp')->default(0);
            $table->integer('required_lessons')->default(0);

            // type & criteria
            $table->string('type')->default('manual');
            $table->json('criteria')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};