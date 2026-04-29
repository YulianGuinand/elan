<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'name' => $user->name, // Accesseur nom complet
                    'email' => $user->email,
                    'fonction' => $user->fonction,
                    'role' => $user->role,
                    'role_id' => $user->role_id,
                ] : null,
                'permissions' => $user ? [
                    'canAccessUsers' => $user->isSuperAdmin(),
                    'canViewSurveys' => true,
                    'canManageEcoles' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canViewEcoles' => true,
                    'canManageFormations' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canViewFormations' => true,
                    'canManageContrats' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canViewContrats' => true,
                    'canManageEntreprise' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canViewEntreprise' => true,
                    'canManageParticipants' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canViewParticipants' => true,
                    'canCreateSurveys' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canManageSurveys' => $user->isAdmin() || $user->isSuperAdmin(),
                    'canAccessReports' => true,
                ] : [],
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'message' => fn() => $request->session()->get('message'),
            ],
        ];
    }
}
