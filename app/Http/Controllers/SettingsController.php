<?php

namespace App\Http\Controllers;

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
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'role' => 'Administrateur CFA', // TODO: A adapter
                'avatar' => null,
                'two_factor_enabled' => false, // TODO: A adapter
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        // Combiner prenom et nom
        $user->name = $validated['first_name'].' '.$validated['last_name'];
        $user->email = $validated['email'];

        // Si email a change, reinitialiser la verification
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            $user->sendEmailVerificationNotification();
        }

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
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Mot de passe mis a jour avec succes.');
    }

    /**
     * Met a jour les preferences de notifications
     */
    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => ['boolean'],
            'survey_reminders' => ['boolean'],
            'response_alerts' => ['boolean'],
            'weekly_reports' => ['boolean'],
            'system_updates' => ['boolean'],
        ]);

        // Exemple: Stocker dans la table users ou une table de preferences
        // $user->preferences()->update($validated);

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
     * Recupere les preferences de notifications (placeholder)
     */
    private function getNotificationPreferences(): array
    {
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
