<?php

namespace Database\Factories;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class UtilisateurFactory extends Factory
{
    protected $model = Utilisateur::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'fonction' => fake()->jobTitle(),
            'email' => fake()->unique()->safeEmail(),
            'mdp' => fake()->password(),
            'role' => 'utilisateur',
            'email_verified_at' => now(),
        ];
    }

    public function admin(): Factory
    {
        return $this->state(fn () => [
            'role' => 'admin',
        ]);
    }

    public function superAdmin(): Factory
    {
        return $this->state(fn () => [
            'role' => 'superadmin',
        ]);
    }
}
