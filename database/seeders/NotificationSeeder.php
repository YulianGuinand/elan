<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des préférences de notification pour tous les utilisateurs
        $utilisateurs = Utilisateur::all();

        foreach ($utilisateurs as $user) {
            NotificationPreference::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'email_notifications' => true,
                    'survey_reminders' => true,
                    'response_alerts' => true,
                    'weekly_reports' => true,
                    'system_updates' => true,
                ]
            );

            // Créer quelques notifications de test
            $notifications = [
                [
                    'type' => 'survey_reminders',
                    'title' => 'Nouvelle enquête disponible',
                    'message' => 'Une nouvelle enquête intitulée "Satisfaction 2026" est disponible et nécessite votre attention.',
                    'read_at' => null,
                ],
                [
                    'type' => 'response_alerts',
                    'title' => 'Nouvelles réponses reçues',
                    'message' => '5 nouvelles réponses ont été enregistrées pour votre enquête "Feedback Produit".',
                    'read_at' => now()->subDay(),
                ],
                [
                    'type' => 'system_updates',
                    'title' => 'Mise à jour système',
                    'message' => 'Une nouvelle version du système est disponible. Certaines améliorations de performance ont été apportées.',
                    'read_at' => now()->subDays(3),
                ],
                [
                    'type' => 'weekly_reports',
                    'title' => 'Rapport hebdomadaire',
                    'message' => 'Votre rapport hebdomadaire est prêt. Consultez les statistiques de la semaine écoulée.',
                    'read_at' => now()->subWeek(),
                ],
            ];

            foreach ($notifications as $notif) {
                Notification::create([
                    'user_id' => $user->id,
                    ...$notif,
                ]);
            }
        }
    }
}

