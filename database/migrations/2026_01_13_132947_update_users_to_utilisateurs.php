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
        Schema::rename('users', 'utilisateurs');

        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->renameColumn('name', 'nom');
            $table->renameColumn('password', 'mdp');

            $table->string('prenom')->after('nom');
            $table->string('fonction')->after('prenom');
            $table->string('role')->after('mdp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            //
        });
    }
};
