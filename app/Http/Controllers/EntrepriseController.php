<?php

namespace App\Http\Controllers;

use App\Services\ExcelService;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    public function __construct(private ExcelService $excelService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $entreprises = Entreprise::all();
        return Inertia::render('Entreprises/Index', [
            'entreprises' => $entreprises,
        ]);
    }

    /**
     * Store a newly created resource in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:50',
            'mail' => 'required|email|max:100',
            'telephone' => 'required|string|max:15',
            'ville' => 'nullable|string|max:50',
            'interlocuteur' => 'required|string|max:100',
        ]);

        // 1. Création de l'entreprise
        $entreprise = Entreprise::create($validated);

        // 2. Création ou association du contact principal (Employeur)
        $names = explode(' ', trim($validated['interlocuteur']), 2);
        $prenom = $names[0];
        $nom = $names[1] ?? 'NC'; // Si un seul mot est renseigné

        $employeur = \App\Models\Participant::firstOrCreate(
            ['mail' => $validated['mail']], // On suppose que le mail est unique
            [
                'nom' => $nom,
                'prenom' => $prenom,
                'telephone' => $validated['telephone'],
                'statut' => 'actif',
                'role' => 'Employeur',
            ]
        );

        // 3. Liaison de l'entreprise avec son employeur via la table pivot "engager"
        $entreprise->participants()->syncWithoutDetaching([$employeur->id]);

        return redirect()->back()->with('success', 'Entreprise ajoutée avec succès.');
    }

    /**
     * Import depuis un fichier CSV/Excel via ExcelService (visuel uniquement → dd).
     */
    public function importCsv(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file',
        ]);

        try {
            $donnees = $this->excelService->importEntreprises(
                $request->file('fichier')
            );

            dd([
                'nb_lignes'  => $donnees->count(),
                'entreprises' => $donnees->values()->all(),
            ]);
        } catch (\Throwable $e) {
            dd([
                'erreur'  => $e->getMessage(),
                'fichier' => $request->file('fichier')->getClientOriginalName(),
                'mime'    => $request->file('fichier')->getMimeType(),
            ]);
        }
    }

    /**
     * Telecharger un fichier CSV exemple.
     */
    public function downloadExemple()
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="exemple_entreprises.csv"',
        ];

        $colonnes = [
            'raison_sociale',
            'siret',
            'secteur',
            'taille',
            'mail',
            'telephone',
            'interlocuteur',
            'fonction',
            'ville',
            'adresse',
            'code_postal',
        ];

        $exemple = [
            'Tech Solutions SAS',
            '12345678901234',
            'Informatique & Tech',
            'pme',
            'contact@techsolutions.fr',
            '06 12 34 56 78',
            'Marie Dupont',
            'Responsable RH',
            'Paris',
            '12 rue de la Paix',
            '75001',
        ];

        $callback = function () use ($colonnes, $exemple) {
            $handle = fopen('php://output', 'w');
            // BOM UTF-8 pour Excel
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($handle, $colonnes, ';');
            fputcsv($handle, $exemple, ';');
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $entreprise = Entreprise::find($id);
        return Inertia::render('Entreprises/Show', compact('entreprise'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        dd(['id_supprime' => $id]);
    }
}
