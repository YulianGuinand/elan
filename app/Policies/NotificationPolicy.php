<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\Utilisateur;

class NotificationPolicy
{
    /**
     * Déterminer si l'utilisateur peut voir une notification
     */
    public function view(Utilisateur $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    /**
     * Déterminer si l'utilisateur peut supprimer une notification
     */
    public function delete(Utilisateur $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Notification $notification): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Notification $notification): bool
    {
        return false;
    }
}
