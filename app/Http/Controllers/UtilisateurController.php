<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

use function Pest\Laravel\withExceptionHandling;

class UtilisateurController extends Controller
{
    /**
     * Affiche la liste des utilisateurs
     */
    public function index()
    {
        $utilisateurs = Utilisateur::all();
        return view('utilisateurs.index', compact('utilisateurs'));
    }

    /**
     * Affiche le formulaire de création d'un nouvel utilisateur
     */
    public function create()
    {
        return view('utilisateurs.create');
    }

    /**
     * Enregistre un nouvel utilisateur dans la base de données
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'fonction' => 'nullable|string|max:255',
                'email' => 'required|email|unique:utilisateurs,email',
                'mdp' => 'required|string|min:8|confirmed',
                'role' => 'required',
            ]);

            Utilisateur::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'fonction' => $validatedData['fonction'],
                'email' => $validatedData['email'],
                'mdp' => bcrypt($validatedData['mdp']),
                'role' => $validatedData['role'],
            ]);

            return redirect()->route('utilisateurs.index')->with('success', 'Utilisateur créé avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la création de l\'utilisateur.']);
        }
    }

    /**
     * Affiche les détails d'un utilisateur spécifique
     */
    public function show($id)
    {
        // Logique pour récupérer et afficher les détails d'un utilisateur
    }

    /**
     * Affiche le formulaire d'édition d'un utilisateur existant
     */
    public function edit($id)
    {
        // Logique pour afficher le formulaire d'édition d'un utilisateur
    }

    /**
     * Met à jour les informations d'un utilisateur existant dans la base de données
     */
    public function update(Request $request, $id)
    {
        // Logique pour valider et mettre à jour un utilisateur existant
    }

    /**
     * Supprime un utilisateur de la base de données
     */
    public function destroy($id)
    {
        // Logique pour supprimer un utilisateur de la base de données
    }
}
