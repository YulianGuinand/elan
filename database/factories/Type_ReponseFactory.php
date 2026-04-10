<?php

namespace Database\Factories;

use App\Models\Type_Reponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class Type_ReponseFactory extends Factory
{
    protected $model = Type_Reponse::class;

    public function definition(): array
    {
        return [
            'libelle' => fake()->randomElement([
                'Réponse courte',
                'Réponse longue',
                'Choix unique',
                'Choix multiples',
                'Échelle de Likert',
                'Date',
            ]),
        ];
    }
}
