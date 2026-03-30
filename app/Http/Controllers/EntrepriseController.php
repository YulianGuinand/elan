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
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $ville = (string) $request->input('ville', 'all');
        $contact = (string) $request->input('contact', 'all');

        $query = Entreprise::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('raison_sociale', 'like', "%{$search}%")
                    ->orWhere('mail', 'like', "%{$search}%")
                    ->orWhere('telephone', 'like', "%{$search}%")
                    ->orWhere('interlocuteur', 'like', "%{$search}%")
                    ->orWhere('ville', 'like', "%{$search}%");
            });
        }

        if ($ville !== 'all') {
            $query->where('ville', $ville);
        }

        if ($contact === 'with_contact') {
            $query->whereNotNull('interlocuteur')->where('interlocuteur', '!=', '');
        } elseif ($contact === 'without_contact') {
            $query->where(function ($q) {
                $q->whereNull('interlocuteur')->orWhere('interlocuteur', '');
            });
        }

        $entreprises = $query
            ->orderBy('raison_sociale')
            ->paginate(5)
            ->withQueryString();

        $availableVilles = Entreprise::query()
            ->select('ville')
            ->whereNotNull('ville')
            ->where('ville', '!=', '')
            ->distinct()
            ->orderBy('ville')
            ->pluck('ville')
            ->values();

        $stats = [
            'total' => Entreprise::count(),
            'with_contact' => Entreprise::query()
                ->whereNotNull('interlocuteur')
                ->where('interlocuteur', '!=', '')
                ->count(),
        ];

        return Inertia::render('Entreprises/Index', [
            'entreprises' => $entreprises,
            'filters' => [
                'search' => $search,
                'ville' => $ville,
                'contact' => $contact,
            ],
            'availableVilles' => $availableVilles,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created resource in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:50',
            'mail'           => 'required|email|max:100',
            'telephone'      => 'nullable|string|max:15',
            'ville'          => 'nullable|string|max:50',
            'interlocuteur'  => 'nullable|string|max:100',
        ]);

        Entreprise::create($validated);

        return redirect()->back()->with('success', 'Entreprise ajoutée avec succès.');
    }

    /**
     * Import depuis un fichier CSV/Excel via ExcelService.
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
                'nb_lignes'   => $donnees->count(),
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

        $colonnes = ['raison_sociale', 'siret', 'secteur', 'taille', 'mail', 'telephone', 'interlocuteur', 'fonction', 'ville', 'adresse', 'code_postal'];
        $exemple  = ['Tech Solutions SAS', '12345678901234', 'Informatique & Tech', 'pme', 'contact@techsolutions.fr', '06 12 34 56 78', 'Marie Dupont', 'Responsable RH', 'Paris', '12 rue de la Paix', '75001'];

        $callback = function () use ($colonnes, $exemple) {
            $handle = fopen('php://output', 'w');
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
    public function show(Entreprise $entreprise)
    {
        return Inertia::render('Entreprises/Show', [
            'entreprise' => $entreprise,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Entreprise $entreprise)
    {
        return Inertia::render('Entreprises/Edit', [
            'entreprise' => $entreprise,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entreprise $entreprise)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:50',
            'mail'           => 'required|email|max:100',
            'telephone'      => 'nullable|string|max:15',
            'ville'          => 'nullable|string|max:50',
            'interlocuteur'  => 'nullable|string|max:100',
        ]);

        $entreprise->update($validated);

        return redirect()->route('entreprises.show', $entreprise->id)
            ->with('success', 'Entreprise modifiée avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entreprise $entreprise)
    {
        $entreprise->delete();

        return redirect()->route('entreprises.index')
            ->with('success', 'Entreprise supprimée avec succès.');
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:entreprises,id',
        ]);

        Entreprise::whereIn('id', $request->ids)->delete();

        return redirect()->route('entreprises.index')
            ->with('success', count($request->ids) . ' entreprise(s) supprimée(s).');
    }
}
