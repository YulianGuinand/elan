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
        Schema::table('participer', function (Blueprint $table) {
            $table->string('statut_envoi')->default('unsent')->after('jeton');
            $table->timestamp('date_envoi')->nullable()->after('statut_envoi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participer', function (Blueprint $table) {
            $table->dropColumn('statut_envoi');
            $table->dropColumn('date_envoi');
        });
    }
};
