<?php

use App\Models\Enquete;
use App\Models\Utilisateur;
use App\Models\Question;

beforeEach(function () {
    $this->user = Utilisateur::factory()->create();
    $this->survey = Enquete::factory()->for($this->user, 'utilisateur')->create();
});

describe('Enquete Model', function () {
    it('can create an enquete', function () {
        $enquete = Enquete::factory()->create();

        expect($enquete->id)->toBeGreaterThan(0);
        expect($enquete->titre)->toBeTruthy();
        expect($enquete->statut)->toBe('brouillon');
    });

    it('belongs to a user', function () {
        expect($this->survey->utilisateur)->toBeInstanceOf(Utilisateur::class);
        expect($this->survey->utilisateur_id)->toBe($this->user->id);
    });

    it('has many questions', function () {
        $question1 = Question::factory()->for($this->survey, 'enquete')->create();
        $question2 = Question::factory()->for($this->survey, 'enquete')->create();

        $questions = $this->survey->questions;

        expect($questions)->toHaveCount(2);
        expect($questions->pluck('id')->contains($question1->id))->toBeTrue();
        expect($questions->pluck('id')->contains($question2->id))->toBeTrue();
    });

    it('can be set as active', function () {
        $activeSurvey = Enquete::factory()->active()->create();

        expect($activeSurvey->statut)->toBe('active');
        expect($activeSurvey->date_debut)->toBeInstanceOf(\Carbon\Carbon::class);
        expect($activeSurvey->date_fin)->toBeInstanceOf(\Carbon\Carbon::class);
    });

    it('can be set as closed', function () {
        $closedSurvey = Enquete::factory()->closed()->create();

        expect($closedSurvey->statut)->toBe('terminee');
    });

    it('filters by status correctly', function () {
        Enquete::factory()->active()->count(3)->create();
        Enquete::factory()->closed()->count(2)->create();
        Enquete::factory()->draft()->count(1)->create();

        $active = Enquete::where('statut', 'active')->count();
        $closed = Enquete::where('statut', 'terminee')->count();
        $draft = Enquete::where('statut', 'brouillon')->count();

        expect($active)->toBe(3);
        expect($closed)->toBe(2);
        expect($draft)->toBe(1);
    });

    it('has correct fillable attributes', function () {
        $fillable = $this->survey->getFillable();

        expect($fillable)->toContain('titre');
        expect($fillable)->toContain('description');
        expect($fillable)->toContain('date_debut');
        expect($fillable)->toContain('date_fin');
        expect($fillable)->toContain('type_campagne');
        expect($fillable)->toContain('utilisateur_id');
    });

    it('casts dates correctly', function () {
        $date = '2026-04-10';
        $enquete = Enquete::factory()->create([
            'date_debut' => $date,
            'date_fin' => $date,
        ]);

        expect($enquete->date_debut)->toBeInstanceOf(\Carbon\Carbon::class);
        expect($enquete->date_fin)->toBeInstanceOf(\Carbon\Carbon::class);
    });
});
