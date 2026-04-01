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
        Schema::table('questions', function (Blueprint $table) {
            // 'emoji' pour Likert avec emojis prédéfinis, 'custom' pour choix personnalisés
            $table->enum('likert_style', ['emoji', 'custom'])->default('emoji')->after('type_reponse_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('likert_style');
        });
    }
};
