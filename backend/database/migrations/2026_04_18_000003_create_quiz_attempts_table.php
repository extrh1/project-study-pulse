<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('quiz_id')
                ->constrained()
                ->onDelete('cascade');

            $table->integer('score')->default(0);

            $table->integer('max_score')->default(0);

            $table->boolean('passed')->default(false);

            $table->json('answers')->nullable();
            // format: [{question_id, selected, correct}]

            $table->integer('earned_xp')->default(0);

            $table->integer('duration_seconds')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            // indexes (important for performance)
            $table->index('user_id');
            $table->index('quiz_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};