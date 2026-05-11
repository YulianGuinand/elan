<?php

use App\Models\Utilisateur;
use App\Models\Enquete;
use App\Models\Question;

describe('SurveyController', function () {
    beforeEach(function () {
        $this->admin = Utilisateur::factory()->admin()->create();
        $this->superAdmin = Utilisateur::factory()->superAdmin()->create();
        $this->user = Utilisateur::factory()->create();
    });

    describe('Survey Listing', function () {
        it('user can view surveys index when authenticated', function () {
            $response = $this->actingAs($this->user)
                ->get('/enquetes');

            $response->assertStatus(200);
            $response->assertViewIs('app');
        });

        it('redirects to login when not authenticated', function () {
            $response = $this->get('/enquetes');

            $response->assertRedirect('/login');
        });

        it('displays user own surveys', function () {
            $survey1 = Enquete::factory()->for($this->user, 'utilisateur')->create();
            $survey2 = Enquete::factory()->for($this->user, 'utilisateur')->create();
            $otherSurvey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->user)
                ->get('/enquetes');

            $response->assertStatus(200);
            $response->assertViewIs('app');
        });
    });

    describe('Survey Creation', function () {
        it('admin can access create survey page', function () {
            $response = $this->actingAs($this->admin)
                ->get('/enquetes/creer');

            $response->assertStatus(200);
        });

        it('regular user cannot access create survey page', function () {
            $response = $this->actingAs($this->user)
                ->get('/enquetes/creer');

            $response->assertStatus(403);
        });

        it('superadmin can access create survey page', function () {
            $response = $this->actingAs($this->superAdmin)
                ->get('/enquetes/creer');

            $response->assertStatus(200);
        });
    });

    describe('Survey Filling', function () {
        it('anyone can access active survey fill page', function () {
            $survey = Enquete::factory()->active()->create();

            $response = $this->actingAs($this->user)
                ->get("/enquetes/{$survey->id}/remplir");

            $response->assertStatus(200);
        });

        it('cannot access inactive survey fill page', function () {
            $survey = Enquete::factory()->draft()->create();

            $response = $this->actingAs($this->user)
                ->get("/enquetes/{$survey->id}/remplir");

            $response->assertStatus(404);
        });

        it('submitting survey response stores data', function () {
            $survey = Enquete::factory()->active()->create();
            $question = Question::factory()->for($survey, 'enquete')->create();

            $response = $this->actingAs($this->user)
                ->post("/enquetes/{$survey->id}/remplir", [
                'responses' => [
                    $question->id => 'Sample response',
                ],
            ]);

            $response->assertStatus(302); // Redirect after success
        });
    });

    describe('Survey Management', function () {
        it('admin can view survey responses', function () {
            $survey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->admin)
                ->get("/enquetes/{$survey->id}/reponses");

            $response->assertStatus(200);
        });

        it('regular user cannot view survey responses', function () {
            $survey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->user)
                ->get("/enquetes/{$survey->id}/reponses");

            $response->assertStatus(403);
        });

        it('admin can edit own survey', function () {
            $survey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->admin)
                ->get("/enquetes/{$survey->id}/modifier");

            $response->assertStatus(200);
        });

        it('admin cannot edit other surveys', function () {
            $survey = Enquete::factory()->for($this->superAdmin, 'utilisateur')->create();

            $response = $this->actingAs($this->admin)
                ->get("/enquetes/{$survey->id}/modifier");

            $response->assertStatus(403);
        });

        it('superadmin can delete any survey', function () {
            $survey = Enquete::factory()->create();

            $response = $this->actingAs($this->superAdmin)
                ->delete("/enquetes/{$survey->id}");

            $response->assertStatus(302);
            expect(Enquete::find($survey->id))->toBeNull();
        });

        it('admin cannot delete all surveys', function () {
            Enquete::factory()->count(3)->create();

            $response = $this->actingAs($this->admin)
                ->delete('/enquetes/tout');

            $response->assertStatus(403);
        });

        it('superadmin can delete all surveys', function () {
            Enquete::factory()->count(3)->create();
            $initialCount = Enquete::count();

            $response = $this->actingAs($this->superAdmin)
                ->delete('/enquetes/tout');

            $response->assertStatus(302);
            expect(Enquete::count())->toBeLessThan($initialCount);
        });
    });

    describe('Survey Duplication', function () {
        it('admin can duplicate their own survey', function () {
            $survey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->admin)
                ->post("/enquetes/{$survey->id}/dupliquer");

            $response->assertStatus(302);
            expect(Enquete::where('titre', 'like', '%' . $survey->titre . '%')->count())->toBe(2);
        });

        it('user cannot duplicate surveys', function () {
            $survey = Enquete::factory()->for($this->admin, 'utilisateur')->create();

            $response = $this->actingAs($this->user)
                ->post("/enquetes/{$survey->id}/dupliquer");

            $response->assertStatus(403);
        });
    });
});
