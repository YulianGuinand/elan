<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Enquete;
use App\Models\Type_Reponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'libelle' => fake()->sentence(),
            'numero' => fake()->numberBetween(1, 10),
            'type_reponse_id' => Type_Reponse::factory(),
            'enquete_id' => Enquete::factory(),
        ];
    }
}
