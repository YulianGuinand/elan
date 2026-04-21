<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    private function allowedRoles(Utilisateur $authUser): array
    {
        return $authUser->isSuperAdmin() ? ['utilisateur', 'admin'] : ['utilisateur'];
    }

    public function index(Request $request)
    {
        $query = Utilisateur::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('fonction', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Users/Index', [
            'users'          => $users,
            'filters'        => $request->only(['search']),
            'availableRoles' => $this->allowedRoles($request->user()),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Users/Create', [
            'availableRoles' => $this->allowedRoles($request->user()),
        ]);
    }

    public function store(Request $request)
    {
        $authUser = $request->user();
        $allowed  = $this->allowedRoles($authUser);

        $validated = $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:utilisateurs,email',
            'fonction' => 'nullable|string|max:255',
            'role'     => ['required', Rule::in($allowed)],
            'mdp'      => 'required|string|min:8|confirmed',
        ]);

        $validated['mdp'] = Hash::make($validated['mdp']);

        Utilisateur::create($validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur cr�� avec succ�s.');
    }

    public function edit(Request $request, Utilisateur $user)
    {
        $authUser = $request->user();

        if (!$authUser->isSuperAdmin() && $user->role !== 'utilisateur') {
            abort(403, "Vous n'avez pas la permission de modifier cet utilisateur.");
        }
        if ($user->role === 'superadmin') {
            abort(403, "Le compte super administrateur ne peut pas �tre modifi�.");
        }

        return Inertia::render('Users/Edit', [
            'user'           => $user->only(['id', 'nom', 'prenom', 'email', 'fonction', 'role']),
            'availableRoles' => $this->allowedRoles($authUser),
        ]);
    }

    public function update(Request $request, Utilisateur $user)
    {
        $authUser = $request->user();
        $allowed  = $this->allowedRoles($authUser);

        if (!$authUser->isSuperAdmin() && $user->role !== 'utilisateur') {
            abort(403, "Vous n'avez pas la permission de modifier cet utilisateur.");
        }
        if ($user->role === 'superadmin') {
            abort(403, "Le compte super administrateur ne peut pas �tre modifi�.");
        }

        $validated = $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:utilisateurs,email,' . $user->id,
            'fonction' => 'nullable|string|max:255',
            'role'     => ['required', Rule::in($allowed)],
            'mdp'      => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['mdp'])) {
            $validated['mdp'] = Hash::make($validated['mdp']);
        } else {
            unset($validated['mdp']);
        }

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur mis � jour avec succ�s.');
    }

    public function destroy(Request $request, Utilisateur $user)
    {
        $authUser = $request->user();

        if (!$authUser->isSuperAdmin() && $user->role !== 'utilisateur') {
            abort(403, "Vous n'avez pas la permission de supprimer cet utilisateur.");
        }
        if ($user->role === 'superadmin') {
            abort(403, "Le compte super administrateur ne peut pas �tre supprim�.");
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'Utilisateur supprim� avec succ�s.');
    }
}
