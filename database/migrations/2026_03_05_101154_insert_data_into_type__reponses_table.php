<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('type__reponses')->insert([
            [
                'libelle' => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'textarea',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'radio',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'checkbox',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'select',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'number',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'likert',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'libelle' => 'date',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('type__reponses')->whereIn('libelle', [
            'text',
            'textarea',
            'radio',
            'checkbox',
            'select',
            'number',
            'likert',
            'date'

        ])->delete();
    }
};
