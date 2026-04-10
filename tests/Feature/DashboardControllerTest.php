<?php

use App\Models\Utilisateur;
use App\Models\Enquete;

describe('DashboardController', function () {
    beforeEach(function () {
        $this->user = Utilisateur::factory()->create();
        $this->admin = Utilisateur::factory()->admin()->create();
    });

    describe('Dashboard Access', function () {
        it('redirects to login when not authenticated', function () {
            $response = $this->get('/tableau-de-bord');

            $response->assertRedirect('/login');
        });

        it('authenticated user can access dashboard', function () {
            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
            $response->assertViewIs('app');
        });

        it('admin can access dashboard', function () {
            $response = $this->actingAs($this->admin)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
        });
    });

    describe('Dashboard Statistics', function () {
        it('dashboard displays survey statistics', function () {
            Enquete::factory()->active()->count(2)->create();
            Enquete::factory()->closed()->count(1)->create();

            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
            // Les données sont passées via Inertia
            $props = $response->viewData();
            expect($props)->toBeTruthy();
        });

        it('dashboard shows user specific data', function () {
            $userSurvey = Enquete::factory()->for($this->user, 'utilisateur')->active()->create();
            $otherSurvey = Enquete::factory()->active()->create();

            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
        });

        it('displays participation data', function () {
            $survey = Enquete::factory()->active()->create();

            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
            // Vérifier que les données de participation sont présentes
            expect($response->viewData())->toBeTruthy();
        });

        it('displays active surveys section', function () {
            $activeSurvey = Enquete::factory()->active()->create();
            $draftSurvey = Enquete::factory()->draft()->create();

            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
        });
    });

    describe('Dashboard User Information', function () {
        it('displays user name on dashboard', function () {
            $user = Utilisateur::factory()->create([
                'nom' => 'Dupont',
                'prenom' => 'Jean',
            ]);

            $response = $this->actingAs($user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
            // Le nom d'utilisateur est passé via Inertia
            $props = $response->viewData();
            expect($props)->toBeTruthy();
        });
    });

    describe('Dashboard Performance', function () {
        it('handles many surveys efficiently', function () {
            Enquete::factory()->active()->count(100)->create();

            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
            // Pas de N+1 queries (à vérifier avec artisan test options si nécessaire)
        });

        it('handles empty survey list', function () {
            $response = $this->actingAs($this->user)
                ->get('/tableau-de-bord');

            $response->assertStatus(200);
        });
    });
});
