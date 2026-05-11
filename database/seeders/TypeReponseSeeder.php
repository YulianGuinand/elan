<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeReponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['libelle' => 'Texte court', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Texte long', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Choix unique', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Choix multiples', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Liste déroulante', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Nombre', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Date', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'Échelle linéaire', 'created_at' => now(), 'updated_at' => now()],
        ];

        \App\Models\Type_Reponse::insert($types);
    }
}
