<?php

namespace App\Listeners;

use App\Events\SurveyCreated;
use App\Models\Notification;
use App\Models\Utilisateur;

class CreateNotificationOnSurveyCreated
{
    public function handle(SurveyCreated $event): void
    {
        $enquete = $event->enquete;

        // Récupérer tous les utilisateurs qui ont activé les rappels d'enquête
        $users = Utilisateur::whereHas('notificationPreference', function ($query) {
            $query->where('survey_reminders', true);
        })->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'survey_reminders',
                'title' => 'Nouvelle enquête disponible',
                'message' => "Une nouvelle enquête intitulée \"" . $enquete->titre . "\" a été créée et est disponible.",
            ]);
        }
    }
}
