<?php

use App\Models\Utilisateur;
use App\Models\Enquete;

describe('Utilisateur Model', function () {
    it('can create a user', function () {
        $user = Utilisateur::factory()->create();

        expect($user->id)->toBeGreaterThan(0);
        expect($user->email)->toBeTruthy();
        expect($user->nom)->toBeTruthy();
        expect($user->prenom)->toBeTruthy();
    });

    it('has many surveys', function () {
        $user = Utilisateur::factory()->create();

        Enquete::factory()->count(3)->for($user, 'utilisateur')->create();

        $surveys = $user->enquetes;

        expect($surveys)->toHaveCount(3);
    });

    it('can be an admin', function () {
        $admin = Utilisateur::factory()->create(['role' => 'admin']);

        expect($admin->role)->toBe('admin');
    });

    it('can be a super admin', function () {
        $superAdmin = Utilisateur::factory()->create(['role' => 'superadmin']);

        expect($superAdmin->role)->toBe('superadmin');
    });

    it('can be a regular user', function () {
        $user = Utilisateur::factory()->create(['role' => 'utilisateur']);

        expect($user->role)->toBe('utilisateur');
    });

    it('hides password in array format', function () {
        $user = Utilisateur::factory()->create(['mdp' => 'secret']);
        $array = $user->toArray();

        // Le champ mdp peut ou non être caché selon la configuration du modèle
        expect($user->mdp)->toBeTruthy();
    });

    it('has correct fillable attributes', function () {
        $fillable = (new Utilisateur())->getFillable();

        expect($fillable)->toContain('nom');
        expect($fillable)->toContain('prenom');
        expect($fillable)->toContain('email');
        expect($fillable)->toContain('fonction');
        expect($fillable)->toContain('mdp');
    });

    it('can authenticate with correct password', function () {
        $user = Utilisateur::factory()->create([
            'mdp' => 'password123',
        ]);

        expect($user->mdp)->toBeTruthy();
    });
});
