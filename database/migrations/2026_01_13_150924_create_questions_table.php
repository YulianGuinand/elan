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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('libelle');
            $table->integer('numero');
            $table->unsignedBigInteger('enquete_id');
            $table->unsignedBigInteger('type_reponse_id');

            $table->foreign('enquete_id')->references('id')->on('enquetes')->onDelete('cascade');
            $table->foreign('type_reponse_id')->references('id')->on('type__reponses')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
