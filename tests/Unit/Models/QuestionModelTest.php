<?php

use App\Models\Question;
use App\Models\Enquete;
use App\Models\Type_Reponse;

beforeEach(function () {
    $this->enquete = Enquete::factory()->create();
    $this->typeReponse = Type_Reponse::factory()->create();
});

describe('Question Model', function () {
    it('can create a question', function () {
        $question = Question::factory()->create();

        expect($question->id)->toBeGreaterThan(0);
        expect($question->libelle)->toBeTruthy();
    });

    it('belongs to an enquete', function () {
        $question = Question::factory()
            ->for($this->enquete, 'enquete')
            ->create();

        expect($question->enquete)->toBeInstanceOf(Enquete::class);
        expect($question->enquete_id)->toBe($this->enquete->id);
    });

    it('belongs to a response type', function () {
        $question = Question::factory()
            ->create(['type_reponse_id' => $this->typeReponse->id]);

        expect($question->typeReponse)->toBeInstanceOf(Type_Reponse::class);
    });

    it('can be required', function () {
        $requiredQuestion = Question::factory()->create(['required' => true]);
        $optionalQuestion = Question::factory()->create(['required' => false]);

        expect($requiredQuestion->required)->toBeTrue();
        expect($optionalQuestion->required)->toBeFalse();
    });

    it('orders by numero attribute', function () {
        $enquete = Enquete::factory()->create();

        Question::factory()->create(['enquete_id' => $enquete->id, 'numero' => 3]);
        Question::factory()->create(['enquete_id' => $enquete->id, 'numero' => 1]);
        Question::factory()->create(['enquete_id' => $enquete->id, 'numero' => 2]);

        $questions = $enquete->questions;
        $numeros = $questions->pluck('numero')->toArray();

        expect($numeros)->toBe([1, 2, 3]);
    });

    it('has correct fillable attributes', function () {
        $fillable = (new Question())->getFillable();

        expect($fillable)->toContain('libelle');
        expect($fillable)->toContain('numero');
        expect($fillable)->toContain('type_reponse_id');
        expect($fillable)->toContain('enquete_id');
    });
});
