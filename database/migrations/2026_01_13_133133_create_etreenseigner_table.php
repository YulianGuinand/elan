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
        Schema::create('etreenseigner', function (Blueprint $table) {
            $table->unsignedBigInteger('ecole_id');
            $table->unsignedBigInteger('forma_id');
            //Clé primaire composite
            $table->primary(['ecole_id', 'forma_id']);

            $table->foreign('ecole_id')
                ->references('id')
                ->on('ecoles')
                ->onDelete('cascade');

            $table->foreign('forma_id')
                ->references('id')
                ->on('formations')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etreenseigner');
    }
};
