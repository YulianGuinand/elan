<?php

namespace App\Services;

use App\Models\Enquete;
use App\Models\Participant;
use Illuminate\Support\Facades\Mail;

class SurveyMailService
{
    /**
     * Envoyer un email de participation à tous les participants d'une enquête
     * @param Enquete $enquete
     * @param array $participantIds - IDs des participants à cibler (optionnel, tous si vide)
     */
    public function sendSurveyInvitations(Enquete $enquete, array $participantIds = []): array
    {
        $query = $enquete->participants();

        // Si pas de sélection spécifique (envoi global), exclure les mails déjà envoyés
        if (empty($participantIds)) {
            $query->wherePivot('statut_envoi', '!=', 'sent');
        } else {
            // Si relance (participants sélectionnés), envoyer à tous les sélectionnés
            $query->whereIn('participant_id', $participantIds);
        }

        $participants = $query->get();

        $results = [
            'sent' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($participants as $participant) {
            try {
                // Générer le lien unique avec jeton
                $jeton = $participant->pivot->jeton ?? uniqid();

                $linkRemplir = route('survey.fill.participants', ['jeton' => $jeton]);

                // Envoyer l'email
                Mail::send('emails.survey-invitation', [
                    'participant' => $participant,
                    'enquete' => $enquete,
                    'lien' => $linkRemplir,
                ], function ($message) use ($participant, $enquete) {
                    $message->to($participant->mail)
                        ->subject("Invitation à répondre : {$enquete->titre}");
                });

                // Marquer comme envoyé dans la table pivot
                $enquete->participants()->updateExistingPivot($participant->id, [
                    'statut_envoi' => 'sent',
                    'date_envoi' => now(),
                ]);

                $results['sent']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = [
                    'participant_id' => $participant->id,
                    'email' => $participant->mail,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Vérifier le statut de réponse d'un participant
     */
    public function getParticipantStatus(Participant $participant, Enquete $enquete): array
    {
        $reponses = $enquete->questions()
            ->whereHas('participants', function ($query) use ($participant) {
                $query->where('participant_id', $participant->id);
            })
            ->count();

        $totalQuestions = $enquete->questions()->count();
        $hasResponded = $reponses > 0;

        return [
            'participant_id' => $participant->id,
            'has_responded' => $hasResponded,
            'responses_count' => $reponses,
            'total_questions' => $totalQuestions,
            'completion_percentage' => $totalQuestions > 0 ? round(($reponses / $totalQuestions) * 100) : 0,
        ];
    }
}
