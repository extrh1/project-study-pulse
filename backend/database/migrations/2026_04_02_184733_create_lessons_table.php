<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();

            // relation with course
            $table->foreignId('course_id')
                ->constrained()
                ->onDelete('cascade');

            //  lesson info
            $table->string('title');
            $table->text('content')->nullable();

            //  progress system (important for LMS)
            $table->integer('order')->default(0);
            $table->integer('xp')->default(10);

            // ✔ completion tracking
            $table->boolean('is_completed')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};