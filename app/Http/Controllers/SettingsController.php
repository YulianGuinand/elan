<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class SettingsController extends Controller
{
  /**
   * Affiche la page des paramètres
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
        'role' => 'Administrateur CFA', // À adapter selon votre système de rôles
        'avatar' => null,
        'two_factor_enabled' => false, // À adapter selon votre système 2FA
      ],
      'notifications' => $this->getNotificationPreferences(),
      'general' => $this->getGeneralSettings(),
    ]);
  }

  /**
   * Met à jour les informations du compte
   */
  public function updateAccount(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'first_name' => ['required', 'string', 'max:255'],
      'last_name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
    ]);

    // Combiner prénom et nom
    $user->name = $validated['first_name'] . ' ' . $validated['last_name'];
    $user->email = $validated['email'];

    // Si l'email a changé, réinitialiser la vérification
    if ($user->isDirty('email')) {
      $user->email_verified_at = null;
      $user->sendEmailVerificationNotification();
    }

    $user->save();

    return back()->with('success', 'Compte mis à jour avec succès.');
  }

  /**
   * Met à jour le mot de passe
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

    return back()->with('success', 'Mot de passe mis à jour avec succès.');
  }

  /**
   * Met à jour les préférences de notifications
   */
  public function updateNotifications(Request $request)
  {
    // À implémenter selon votre système de préférences
    // Vous pouvez stocker les préférences dans une table séparée ou dans un champ JSON

    $validated = $request->validate([
      'email_notifications' => ['boolean'],
      'survey_reminders' => ['boolean'],
      'response_alerts' => ['boolean'],
      'weekly_reports' => ['boolean'],
      'system_updates' => ['boolean'],
    ]);

    // Exemple: Stocker dans la table users ou une table de préférences
    // $user->preferences()->update($validated);

    return back()->with('success', 'Préférences de notifications mises à jour.');
  }

  /**
   * Met à jour les paramètres généraux
   */
  public function updateGeneral(Request $request)
  {
    $validated = $request->validate([
      'language' => ['required', 'string', 'in:fr,en,es'],
      'timezone' => ['required', 'string'],
      'date_format' => ['required', 'string', 'in:DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD'],
      'items_per_page' => ['required', 'integer', 'in:10,25,50,100'],
    ]);

    // Stocker les préférences (exemple)
    // $user->settings()->update($validated);

    return back()->with('success', 'Paramètres généraux mis à jour.');
  }

  /**
   * Récupère les préférences de notifications (placeholder)
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
   * Récupère les paramètres généraux (placeholder)
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
