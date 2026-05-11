<?php

namespace App\Listeners;

use App\Events\ResponseReceived;
use App\Models\Notification;

class CreateNotificationOnResponseReceived
{
    public function handle(ResponseReceived $event): void
    {
        $enquete = $event->enquete;
        $user = $enquete->utilisateur;

        // Créer une notification pour le créateur de l'enquête s'il a activé les alertes de réponses
        if ($user && $user->notificationPreference && $user->notificationPreference->response_alerts) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'response_alerts',
                'title' => $event->responseCount === 1 ? 'Nouvelle réponse reçue' : "{$event->responseCount} nouvelles réponses reçues",
                'message' => "{$event->responseCount} " . ($event->responseCount === 1 ? 'nouvelle réponse a' : 'nouvelles réponses ont') . " été enregistrée(s) pour votre enquête \"" . $enquete->titre . "\".",
            ]);
        }
    }
}
