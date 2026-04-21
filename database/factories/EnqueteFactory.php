<?php

namespace Database\Factories;

use App\Models\Enquete;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnqueteFactory extends Factory
{
    protected $model = Enquete::class;

    public function definition(): array
    {
        return [
            'titre' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'date_debut' => now(),
            'date_fin' => now()->addDays(30),
            'type_campagne' => fake()->randomElement(['insertion', 'satisfaction', 'competences']),
            'utilisateur_id' => Utilisateur::factory(),
        ];
    }

    public function active(): Factory
    {
        return $this->state(fn () => [
            'date_debut' => now()->subDay(),
            'date_fin' => now()->addDays(7),
        ]);
    }

    public function closed(): Factory
    {
        return $this->state(fn () => [
            'date_fin' => now()->subDay(),
        ]);
    }

    public function draft(): Factory
    {
        return $this->state(fn () => [
            'date_debut' => now()->addDay(),
            'date_fin' => now()->addDays(30),
        ]);
    }
}
