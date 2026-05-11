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
        Schema::create('contacter', function (Blueprint $table) {
            $table->unsignedBigInteger('participant_id');
            $table->unsignedBigInteger('enquete_id');
            $table->unsignedBigInteger('utilisateur_id');
            $table->date('date_contact');
            $table->string('moyen');
            $table->string('commentaire');
            $table->primary(['participant_id', 'enquete_id', 'utilisateur_id']);

            $table->foreign('participant_id')
                ->references('id')
                ->on('participants')
                ->onDelete('cascade');

            $table->foreign('enquete_id')
                ->references('id')
                ->on('enquetes')
                ->onDelete('cascade');

            $table->foreign('utilisateur_id')
                ->references('id')
                ->on('utilisateurs')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacter');
    }
};
