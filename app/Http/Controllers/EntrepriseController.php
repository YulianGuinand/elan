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
     * Store a newly created resource in storage (visuel uniquement → dd).
     */
    public function store(Request $request)
    {
        dd($request->all());
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
