<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');
            $table->text('description')->nullable();

            $table->integer('passing_score')->default(70);
            $table->integer('questions_count')->default(0);

            $table->boolean('is_published')->default(false);

            $table->timestamps();

            // indexes
            $table->index('lesson_id');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};