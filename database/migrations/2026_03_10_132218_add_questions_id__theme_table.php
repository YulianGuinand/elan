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
        Schema::table('etredefinit', function (Blueprint $table) {
            $table->dropForeign(['theme_id']);
            $table->dropForeign(['question_id']);
            $table->dropColumn('theme_id');
            $table->dropColumn('question_id');
        });


        Schema::table('themes', function (Blueprint $table) {
            $table->UnsignedBigInteger('question_id');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->dropForeign(['question_id']);
            $table->dropColumn('question_id');
        });
    }
};
