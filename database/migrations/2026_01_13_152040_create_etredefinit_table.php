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
        Schema::create('etredefinit', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('theme_id');
            $table->unsignedBigInteger('question_id');
            $table->foreign('theme_id')->references('id')->on('themes')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etredefinit');
    }
};
