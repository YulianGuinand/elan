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
        Schema::table('entreprises', function (Blueprint $table) {
            $table->string("nom");
            $table->string("prenom");
            $table->string("code_postal");
            $table->dropColumn("interlocuteur");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entreprises', function (Blueprint $table) {
            $table->dropColumn("nom");
            $table->dropColumn("prenom");
            $table->dropColumn("code_postal");
            $table->string("interlocuteur");
        });
    }
};
