<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('quiz_id')
                ->constrained()
                ->onDelete('cascade');

            $table->text('question_text');

            $table->string('question_type')->default('multiple_choice');
            // multiple_choice, true_false, short_answer

            $table->json('options')->nullable();

            $table->string('correct_answer');

            $table->string('difficulty')->default('medium');
            // easy, medium, hard

            $table->integer('points')->default(1);

            $table->integer('order')->default(0);

            $table->timestamps();

            // indexes
            $table->index('quiz_id');
            $table->index('difficulty');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};