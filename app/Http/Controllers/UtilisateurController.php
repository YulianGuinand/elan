<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Formations;
use App\Models\Ecole;
use App\Models\Entreprise;
use App\Models\Contrat;
use App\Models\Utilisateur;
use App\Services\ExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class UtilisateurController extends Controller
{


    public function create()
    {
        // 
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'nom' => 'required|string|max:255|min:3',
            'prenom' => 'required|string|max:255|min:3',
            'fonction' => 'required|string|max:255|min:3',
            'email' => 'required|email|max:255|min:10',
            'mdp' => 'required|string|max:255|min:8',
            'role' => 'required|in:superadmin,utilisateur,admin',
        ]);

        try {
            Utilisateur::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'fonction' => $validated['fonction'],
                'email' => $validated['email'],
                'mdp' => $validated['mdp'],
                'role' => $validated['role'],
            ]);
            
            return redirect()->route('utilisateurs.index')->with('success', 'Participant cree avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la creation : ' . $e->getMessage()]);
        }
    }
}
