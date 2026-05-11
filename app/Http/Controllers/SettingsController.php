<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Affiche la page des parametres
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Settings', [
            'user' => [
                'id' => $user->id,
                'name' => trim($user->prenom . ' ' . $user->nom),
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'role' => $user->role === 'superadmin' ? 'Super Administrateur' : ($user->role === 'admin' ? 'Administrateur' : 'Utilisateur'),
                'avatar' => null,
                'two_factor_enabled' => false,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'notifications' => $this->getNotificationPreferences(),
            'general' => $this->getGeneralSettings(),
        ]);
    }

    /**
     * Met a jour les informations du compte
     */
    public function updateAccount(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:utilisateurs,email,' . $user->id],
        ]);

        $user->prenom = $validated['first_name'];
        $user->nom = $validated['last_name'];
        $user->email = $validated['email'];

        $user->save();

        return back()->with('success', 'Compte mis a jour avec succes.');
    }

    /**
     * Met a jour le mot de passe
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Verifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->mdp)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est incorrect.']);
        }

        $user->mdp = Hash::make($validated['password']);
        $user->save();

        return back()->with('success', 'Mot de passe mis a jour avec succes.');
    }

    /**
     * Met a jour les preferences de notifications
     */
    public function updateNotifications(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'email_notifications' => ['boolean'],
            'survey_reminders' => ['boolean'],
            'response_alerts' => ['boolean'],
            'weekly_reports' => ['boolean'],
            'system_updates' => ['boolean'],
        ]);

        // Créer ou mettre à jour les préférences
        $user->notificationPreference()
            ->firstOrCreate(['user_id' => $user->id])
            ->update($validated);

        return back()->with('success', 'Preferences de notifications mises a jour.');
    }

    /**
     * Met a jour les parametres generaux
     */
    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'in:fr,en,es'],
            'timezone' => ['required', 'string'],
            'date_format' => ['required', 'string', 'in:DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD'],
            'items_per_page' => ['required', 'integer', 'in:10,25,50,100'],
        ]);

        // Stocker les preferences (exemple)
        // $user->settings()->update($validated);

        return back()->with('success', 'Parametres generaux mis a jour.');
    }

    /**
     * Recupere les preferences de notifications depuis la BD
     */
    private function getNotificationPreferences(): array
    {
        $user = Auth::user();
        $preferences = $user->notificationPreference;

        if ($preferences) {
            return [
                'email_notifications' => (bool) $preferences->email_notifications,
                'survey_reminders' => (bool) $preferences->survey_reminders,
                'response_alerts' => (bool) $preferences->response_alerts,
                'weekly_reports' => (bool) $preferences->weekly_reports,
                'system_updates' => (bool) $preferences->system_updates,
            ];
        }

        // Valeurs par défaut si pas de préférences créées
        return [
            'email_notifications' => true,
            'survey_reminders' => true,
            'response_alerts' => false,
            'weekly_reports' => true,
            'system_updates' => true,
        ];
    }

    /**
     * Recupere les parametres generaux (placeholder)
     */
    private function getGeneralSettings(): array
    {
        return [
            'language' => 'fr',
            'timezone' => 'Europe/Paris',
            'date_format' => 'DD/MM/YYYY',
            'items_per_page' => 25,
        ];
    }
}
