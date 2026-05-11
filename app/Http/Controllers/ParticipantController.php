<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Formations;
use App\Models\Ecole;
use App\Models\Entreprise;
use App\Models\Contrat;
use App\Services\ExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function __construct(private ExcelService $excelService) {}

    /**
     * Affiche la liste des participants avec recherche, filtres et pagination
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $program = $request->input('program');
        $perPage = 10;

        $query = Participant::with(['contrats.formation', 'contrats.entreprise', 'contrats.ecole', 'entreprises']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('mail', 'like', "%{$search}%");
            });
        }

        if ($program && $program !== 'all') {
            $query->whereHas('contrats.formation', function ($q) use ($program) {
                $q->where('id', $program);
            });
        }

        $participants = $query->latest()->paginate($perPage)->withQueryString();

        // Extraire la liste des formations pour le filtre
        $formations = Formations::select('id', 'libelle')->orderBy('libelle')->get();

        return Inertia::render('Students', [
            'participants' => $participants,
            'formations' => $formations,
            'filters' => [
                'search' => $search ?? '',
                'program' => $program ?? 'all',
            ],
        ]);
    }

    public function create()
    {
        $ecoles = Ecole::select('id', 'libelle as name')->orderBy('libelle')->get();
        $formations = Formations::select('id', 'libelle as name')->orderBy('libelle')->get();
        $entreprises = Entreprise::select('id', 'raison_sociale as name')->orderBy('raison_sociale')->get();

        return Inertia::render('Participants/Create', [
            'ecoles' => $ecoles,
            'formations' => $formations,
            'entreprises' => $entreprises,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'mail' => 'required|email|max:255',
            'telephone' => 'required|string|max:20',
            'role' => 'required|in:Apprentis,Alumnis,Formateurs,Employeurs',

            // Champs additionnels pour creation inline
            'ecole_id' => 'nullable|string',
            'formation_id' => 'nullable|string',
            'entreprise_id' => 'nullable|string',
            'date_entree' => 'nullable|date',
            'date_sortiee' => 'nullable|date|after_or_equal:date_entree',
        ]);

        try {
            $participant = Participant::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'mail' => $validated['mail'],
                'telephone' => $validated['telephone'],
                'role' => $validated['role'],
            ]);

            // Gestion des creations inline pour Apprenti ou Formateur
            if (in_array($validated['role'], ['Apprentis', 'Formateurs']) && $request->filled('ecole_id') && $request->filled('formation_id')) {
                $ecoleId = $this->resolveInlineCreation(Ecole::class, 'libelle', $validated['ecole_id']);
                $formationId = $this->resolveInlineCreation(Formations::class, 'libelle', $validated['formation_id']);
                $entrepriseId = $request->filled('entreprise_id') ? $this->resolveInlineCreation(Entreprise::class, 'raison_sociale', $validated['entreprise_id']) : null;

                Contrat::create([
                    'participant_id' => $participant->id,
                    'ecole_id' => $ecoleId,
                    'formation_id' => $formationId,
                    'entreprise_id' => $entrepriseId,
                    'utilisateur_id' => \Illuminate\Support\Facades\Auth::id(),
                    'date_entree' => $validated['date_entree'] ?? now()->toDateString(),
                    'date_sortiee' => $validated['date_sortiee'] ?? null,
                ]);
            }

            return redirect()->route('participants.index')->with('success', 'Participant cree avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la creation : ' . $e->getMessage()]);
        }
    }

    /**
     * Helper to resolve new vs existing entity.
     */
    private function resolveInlineCreation($modelClass, $field, $value)
    {
        if (str_starts_with($value, 'NEW_')) {
            $newName = substr($value, 4);
            $entity = $modelClass::create([$field => $newName]);
            return $entity->id;
        }
        return $value;
    }

    public function show(Participant $participant)
    {
        $participant->load(['contrats.formation', 'contrats.entreprise', 'contrats.ecole', 'entreprises']);
        return Inertia::render('Participants/Show', [
            'participant' => $participant
        ]);
    }

    public function edit(Participant $participant)
    {
        return Inertia::render('Participants/Edit', [
            'participant' => $participant
        ]);
    }

    public function update(Request $request, Participant $participant)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'mail' => 'required|email|max:255',
            'telephone' => 'required|string|max:20',
            'role' => 'required|in:Apprentis,Alumnis,Formateurs,Employeurs'
        ]);

        $participant->update($validated);

        return redirect()->route('participants.index')->with('success', 'Participant mis à jour avec succès.');
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();
        return redirect()->route('participants.index')->with('success', 'Participant supprime avec succès.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:participants,id'
        ]);

        Participant::whereIn('id', $request->ids)->delete();

        return redirect()->route('participants.index')->with('success', 'Participants supprimes avec succès.');
    }

    /**
     * Preview du fichier CSV : retourne les lignes parsees + les entites inconnues en JSON.
     */
    public function previewCsv(Request $request)
    {
        $request->validate(['fichier' => 'required|file']);

        try {
            $knownEcoles      = Ecole::pluck('libelle')->toArray();
            $knownFormations  = Formations::pluck('libelle')->toArray();
            $knownEntreprises = Entreprise::pluck('raison_sociale')->toArray();

            $preview = $this->excelService->previewParticipants(
                $request->file('fichier'),
                $knownEcoles,
                $knownFormations,
                $knownEntreprises
            );

            return response()->json($preview);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
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
            $donnees = $this->excelService->importParticipants(
                $request->file('fichier')
            );

            $importedCount = 0;
            foreach ($donnees as $row) {
                // Creer ou trouver le participant
                $participant = Participant::firstOrCreate(
                    ['mail' => $row['mail']],
                    [
                        'nom'       => $row['nom'],
                        'prenom'    => $row['prenom'],
                        'telephone' => $row['telephone'] ?? null,
                        'role'      => $row['role'] ?? 'Apprentis',
                    ]
                );

                // Creer le contrat si ecole + formation fournis
                if (!empty($row['ecole']) || !empty($row['formation']) || !empty($row['entreprise'])) {
                    $ecoleId = null;
                    if (!empty($row['ecole'])) {
                        $ecole = Ecole::firstOrCreate(['libelle' => $row['ecole']]);
                        $ecoleId = $ecole->id;
                    }

                    $formationId = null;
                    if (!empty($row['formation'])) {
                        $formation = Formations::firstOrCreate(['libelle' => $row['formation']]);
                        $formationId = $formation->id;
                    }

                    $entrepriseId = null;
                    if (!empty($row['entreprise'])) {
                        $entreprise = Entreprise::firstOrCreate(['raison_sociale' => $row['entreprise']]);
                        $entrepriseId = $entreprise->id;
                    }

                    Contrat::firstOrCreate(
                        ['participant_id' => $participant->id],
                        [
                            'ecole_id'      => $ecoleId,
                            'formation_id'  => $formationId,
                            'entreprise_id' => $entrepriseId,
                            'utilisateur_id' => \Illuminate\Support\Facades\Auth::id(),
                            'date_entree'   => $row['date_entree'] ?? now()->toDateString(),
                            'date_sortiee'  => $row['date_sortiee'] ?? null,
                        ]
                    );
                }

                $importedCount++;
            }

            return redirect()->back()->with('success', "{$importedCount} participant(s) importe(s) avec succes.");
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors([
                'fichier' => "Erreur lors de l'import : " . $e->getMessage()
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
            'Content-Disposition' => 'attachment; filename="exemple_participants.csv"',
        ];

        $colonnes = ['nom', 'prenom', 'mail', 'telephone', 'role', 'ecole', 'formation', 'entreprise', 'date_entree', 'date_sortiee'];
        $exemples = [
            ['Durand', 'Sophie', 'sophie.durand@email.com', '0601020304', 'Apprentis', 'ENSIIE', 'BTS SIO SLAM', 'Tech Solutions SAS', '2024-09-01', '2026-06-30'],
            ['Martin', 'Lucas', 'lucas.m@email.com', '0711223344', 'Apprentis', 'Lycée Turgot', 'BTS NDRC', 'Boutique Paris', '2025-09-01', '2027-06-30'],
            ['Lefebvre', 'Marie', 'm.lefebvre@email.com', '0699887766', 'Formateurs', '', '', '', '', ''],
            ['Dubois', 'Thomas', 'thomas.dubois@email.com', '0655443322', 'Apprentis', 'ENSIIE', 'Licence Pro', 'Agence Web Creativ', '2024-09-01', '2025-06-30'],
            ['Roux', 'Amélie', 'amelie.r@email.com', '', 'Apprentis', 'École du Web', 'Master Dev', 'Google France', '2024-09-01', '2026-06-30'],
        ];

        $callback = function () use ($colonnes, $exemples) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($handle, $colonnes, ';');
            foreach ($exemples as $ex) {
                fputcsv($handle, $ex, ';');
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
