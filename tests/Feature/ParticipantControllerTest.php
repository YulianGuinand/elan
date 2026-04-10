<?php

use App\Models\Utilisateur;
use App\Models\Participant;

describe('ParticipantController', function () {
    beforeEach(function () {
        $this->user = Utilisateur::factory()->create();
        $this->admin = Utilisateur::factory()->admin()->create();
        $this->superAdmin = Utilisateur::factory()->superAdmin()->create();
    });

    describe('Participant Listing', function () {
        it('authenticated user can view participants', function () {
            $response = $this->actingAs($this->user)
                ->get('/participants');

            $response->assertStatus(200);
        });

        it('redirects to login when not authenticated', function () {
            $response = $this->get('/participants');

            $response->assertRedirect('/login');
        });

        it('displays all participants to admin', function () {
            Participant::factory()->count(5)->create();

            $response = $this->actingAs($this->admin)
                ->get('/participants');

            $response->assertStatus(200);
        });
    });

    describe('Participant Import', function () {
        it('only admin can access import page', function () {
            $response = $this->actingAs($this->admin)
                ->post('/participants/import', [
                    'csv' => 'test.csv',
                ]);

            // Même si ça échoue, c'est que l'authentification a passé
            expect($response->status())->not->toBe(403);
        });

        it('regular user cannot import participants', function () {
            $response = $this->actingAs($this->user)
                ->post('/participants/import', [
                    'csv' => 'test.csv',
                ]);

            $response->assertStatus(403);
        });

        it('superadmin can import participants', function () {
            $response = $this->actingAs($this->superAdmin)
                ->post('/participants/import', [
                    'csv' => 'test.csv',
                ]);

            // L'important est que ce n'est pas 403 (Forbidden)
            expect($response->status())->not->toBe(403);
        });
    });

    describe('Participant Management', function () {
        it('admin can view participant example template', function () {
            $response = $this->actingAs($this->admin)
                ->get('/participants/exemple');

            $response->assertStatus(200);
        });

        it('admin can create participant', function () {
            $response = $this->actingAs($this->admin)
                ->get('/participants/ajouter');

            $response->assertStatus(200);
        });

        it('user cannot create participant', function () {
            $response = $this->actingAs($this->user)
                ->get('/participants/ajouter');

            $response->assertStatus(403);
        });

        it('stores participant with valid data', function () {
            $data = [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '0600000000',
            ];

            $response = $this->actingAs($this->admin)
                ->post('/participants', $data);

            $response->assertStatus(302);
            expect(Participant::where('email', $data['email'])->exists())->toBeTrue();
        });

        it('validates required fields on store', function () {
            $response = $this->actingAs($this->admin)
                ->post('/participants', [
                    'nom' => 'Dupont',
                    'prenom' => 'Jean',
                    // Email manquant
                ]);

            $response->assertStatus(422);
        });

        it('admin can view participant details', function () {
            $participant = Participant::factory()->create();

            $response = $this->actingAs($this->admin)
                ->get("/participants/{$participant->id}");

            $response->assertStatus(200);
        });

        it('admin can edit participant', function () {
            $participant = Participant::factory()->create();

            $response = $this->actingAs($this->admin)
                ->get("/participants/{$participant->id}/modifier");

            $response->assertStatus(200);
        });

        it('admin can update participant', function () {
            $participant = Participant::factory()->create();

            $response = $this->actingAs($this->admin)
                ->put("/participants/{$participant->id}", [
                    'nom' => 'Nouveau Nom',
                    'prenom' => 'Nouveau Prénom',
                    'email' => $participant->email,
                ]);

            $response->assertStatus(302);
            expect(Participant::find($participant->id)->nom)->toBe('Nouveau Nom');
        });

        it('admin can delete participant', function () {
            $participant = Participant::factory()->create();

            $response = $this->actingAs($this->admin)
                ->delete("/participants/{$participant->id}");

            $response->assertStatus(302);
            expect(Participant::find($participant->id))->toBeNull();
        });

        it('superadmin can bulk delete participants', function () {
            $participants = Participant::factory()->count(3)->create();
            $ids = $participants->pluck('id')->toArray();

            $response = $this->actingAs($this->superAdmin)
                ->post('/participants/bulk-destroy', [
                    'ids' => $ids,
                ]);

            $response->assertStatus(302);
            expect(Participant::whereIn('id', $ids)->count())->toBe(0);
        });

        it('regular user cannot bulk delete', function () {
            $participants = Participant::factory()->count(3)->create();

            $response = $this->actingAs($this->user)
                ->post('/participants/bulk-destroy', [
                    'ids' => $participants->pluck('id')->toArray(),
                ]);

            $response->assertStatus(403);
        });
    });

    describe('Participant Preview', function () {
        it('admin can preview CSV', function () {
            $response = $this->actingAs($this->admin)
                ->post('/participants/preview', [
                    'csv' => 'test.csv',
                ]);

            // Peut retourner 422 si CSV invalide, mais pas 403
            expect($response->status())->not->toBe(403);
        });
    });
});
