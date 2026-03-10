<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('themes', 'question_id')) {
            Schema::table('themes', function (Blueprint $table) {
                $table->dropForeign(['question_id']);
                $table->dropColumn('question_id');
            });
        }

        if (!Schema::hasColumn('questions', 'theme_id')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->unsignedBigInteger('theme_id')->nullable();
                $table->foreign('theme_id')->references('id')->on('themes')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['theme_id']);
            $table->dropColumn('theme_id');
        });
    }
};
