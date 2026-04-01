<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    use AuthorizesRequests;

    /**
     * Obtenir le nombre de notifications non lues
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        $unreadCount = $user->notifications()->unread()->count();

        return response()->json(['unreadCount' => $unreadCount]);
    }

    /**
     * Affiche la liste des notifications de utilisateur avec pagination et filtres
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $query = $user->notifications();

        // Recherche par titre ou message
        if ($request->has('search') && $request->get('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filtre par type
        if ($request->has('type') && $request->get('type') && $request->get('type') !== 'all') {
            $query->where('type', $request->get('type'));
        }

        // Filtre par statut (read/unread)
        if ($request->has('status') && $request->get('status')) {
            $status = $request->get('status');
            if ($status === 'unread') {
                $query->whereNull('read_at');
            } elseif ($status === 'read') {
                $query->whereNotNull('read_at');
            }
        }

        // Recuperer le total avant pagination
        $total = $query->count();

        // Pagination
        $perPage = $request->get('per_page', config('pagination.per_page'));
        $page = $request->get('page', 1);
        $paginated = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Formater les notifications
        $notifications = $paginated->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        });

        $unreadCount = $user->notifications()->unread()->count();

        return Inertia::render('Notifications', [
            'notifications' => [
                'data' => $notifications,
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'from' => $paginated->firstItem(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'to' => $paginated->lastItem(),
                    'total' => $paginated->total(),
                ],
            ],
            'unreadCount' => $unreadCount,
            'total' => $total,
            'filters' => [
                'search' => $request->get('search', ''),
                'type' => $request->get('type', 'all'),
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Notification $notification)
    {
        $user = Auth::user();

        // Verifier que la notification appartient a utilisateur
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $notification->markAsRead();

        return back()->with('success', 'Notification marquée comme lue.');
    }

    /**
     * Marquer tous les notifications visibles comme lues
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();

        // Marquer toutes les notifications non lues comme lues
        $user->notifications()
            ->unread()
            ->update(['read_at' => now()]);

        return back()->with('success', 'Toutes les notifications ont été marquées comme lues.');
    }

    /**
     * Supprimer une notification
     */
    public function destroy(Notification $notification)
    {
        $user = Auth::user();

        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $notification->delete();

        return back()->with('success', 'Notification supprimée.');
    }
}
