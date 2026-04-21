<?php

namespace App\Http\Controllers;

use App\Models\Ecole;
use App\Models\Entreprise;
use App\Models\Formations;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controleur pour la creation rapide (inline) d'entites via les modals du formulaire participant.
 * Retourne du JSON pour mise a jour immediate des listes deroulantes cote client.
 */
class InlineCreateController extends Controller
{
    /**
     * Cree une ecole et retourne ses donnees en JSON.
     */
    public function storeEcole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:100',
            'adresse' => 'required|string|max:100',
            'code_postal' => 'required|string|max:5',
            'ville' => 'required|string|max:50',
        ]);

        $ecole = Ecole::create($validated);

        return response()->json([
            'id' => $ecole->id,
            'name' => $ecole->libelle,
        ], 201);
    }

    /**
     * Cree une formation et retourne ses donnees en JSON.
     */
    public function storeFormation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:100',
        ]);

        $formation = Formations::create($validated);

        return response()->json([
            'id' => $formation->id,
            'name' => $formation->libelle,
        ], 201);
    }

    /**
     * Cree une entreprise et retourne ses donnees en JSON.
     */
    public function storeEntreprise(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:50',
            'mail' => 'required|email|max:100',
            'telephone' => 'nullable|string|max:15',
            'ville' => 'nullable|string|max:50',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'code_postal' => 'required|string|max:6',
        ]);

        $entreprise = Entreprise::create($validated);

        return response()->json([
            'id' => $entreprise->id,
            'name' => $entreprise->raison_sociale,
        ], 201);
    }
}
