<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('participer', function (Blueprint $table) {
      $table->enum('canal', ['mail', 'telephone'])->nullable()->after('date_envoi');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('participer', function (Blueprint $table) {
      $table->dropColumn('canal');
    });
  }
};
