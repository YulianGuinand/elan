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
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->boolean('email_notifications')->default(true);
            $table->boolean('survey_reminders')->default(true);
            $table->boolean('response_alerts')->default(true);
            $table->boolean('weekly_reports')->default(true);
            $table->boolean('system_updates')->default(true);
            $table->timestamps();
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
