<?php

namespace App\Listeners;

use App\Events\SurveyClosingSoon;
use App\Models\Notification;
use App\Models\Utilisateur;

class CreateNotificationOnSurveyClosingSoon
{
    public function handle(SurveyClosingSoon $event): void
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
                'title' => 'Enquête bientôt fermée',
                'message' => "L'enquête \"" . $enquete->titre . "\" se termine le " . $enquete->date_fin->format('d/m/Y') . ". Assurez-vous de compléter vos réponses avant la date limite.",
            ]);
        }
    }
}
