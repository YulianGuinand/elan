<?php

namespace Tests;

use App\Models\Utilisateur;
use App\Models\Enquete;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Créer un utilisateur authentifié pour les tests
     */
    public function createAuthenticatedUser(array $attributes = []): Utilisateur
    {
        return Utilisateur::factory()->create($attributes);
    }

    /**
     * Authentifier un utilisateur pour les tests
     */
    public function actingAsUser(Utilisateur $user = null): self
    {
        $user = $user ?? $this->createAuthenticatedUser();
        return $this->actingAs($user);
    }

    /**
     * Créer un utilisateur admin
     */
    public function createAdminUser(array $attributes = []): Utilisateur
    {
        return Utilisateur::factory()
            ->create(array_merge([
                'role' => 'admin',
            ], $attributes));
    }

    /**
     * Créer un super admin
     */
    public function createSuperAdminUser(array $attributes = []): Utilisateur
    {
        return Utilisateur::factory()
            ->create(array_merge([
                'role' => 'superadmin',
            ], $attributes));
    }

    /**
     * Créer une enquête avec utilisateur
     */
    public function createSurvey(Utilisateur $user = null, array $attributes = []): Enquete
    {
        $user = $user ?? $this->createAuthenticatedUser();
        return Enquete::factory()
            ->for($user, 'utilisateur')
            ->create($attributes);
    }

    /**
     * Créer une enquête active
     */
    public function createActiveSurvey(Utilisateur $user = null, array $attributes = []): Enquete
    {
        return $this->createSurvey($user, array_merge([
            'date_debut' => now()->subDay(),
            'date_fin' => now()->addDays(7),
        ], $attributes));
    }
}
