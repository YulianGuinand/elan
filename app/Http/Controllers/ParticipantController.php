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
    public function __construct(private ExcelService $excelService)
    {
    }

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
            $knownEcoles = Ecole::get(["id", "libelle"])->toArray();
            $knownFormations = Formations::get(["id", "libelle"])->toArray();
            $knownEntreprises = Entreprise::get(['raison_sociale', 'id'])->toArray();


            $preview = $this->excelService->previewParticipants(
                $request->file('fichier'),
                array_column($knownEcoles, 'libelle'),
                array_column($knownFormations, 'libelle'),
                array_column($knownEntreprises, 'raison_sociale')
            );

            return response()->json([...$preview, "knownEcoles" => $knownEcoles, "knownFormations" => $knownFormations, "knownEntreprises" => $knownEntreprises]);
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
            'resolutions' => 'nullable|string',
        ]);

        $resolutions = json_decode($request->input('resolutions', '{}'), true);
        if (!is_array($resolutions)) {
            $resolutions = [];
        }

        $resolvedEcoles = is_array($resolutions['ecoles'] ?? null) ? $resolutions['ecoles'] : [];
        $resolvedFormations = is_array($resolutions['formations'] ?? null) ? $resolutions['formations'] : [];
        $resolvedEntreprises = is_array($resolutions['entreprises'] ?? null) ? $resolutions['entreprises'] : [];

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
                        'nom' => $row['nom'],
                        'prenom' => $row['prenom'],
                        'telephone' => $row['telephone'] ?? null,
                        'role' => $row['role'] ?? 'Apprentis',
                    ]
                );

                $ecoleId = $this->resolveEcoleId($row['ecole'] ?? null, $resolvedEcoles);
                $formationId = $this->resolveFormationId($row['formation'] ?? null, $resolvedFormations);
                $entrepriseId = $this->resolveEntrepriseId($row['entreprise'] ?? null, $resolvedEntreprises);

                if ($ecoleId !== null && $formationId !== null) {
                    Contrat::updateOrCreate(
                        ['participant_id' => $participant->id],
                        [
                            'ecole_id' => $ecoleId,
                            'formation_id' => $formationId,
                            'entreprise_id' => $entrepriseId,
                            'utilisateur_id' => \Illuminate\Support\Facades\Auth::id(),
                            'date_entree' => $row['date_entree'] ?? now()->toDateString(),
                            'date_sortiee' => $row['date_sortiee'] ?? null,
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

    private function resolveEcoleId(?string $label, array $resolvedEcoles): ?int
    {
        $label = trim((string) $label);
        if ($label === '') {
            return null;
        }

        if (isset($resolvedEcoles[$label])) {
            return (int) $resolvedEcoles[$label];
        }

        $ecole = Ecole::query()
            ->whereRaw('LOWER(libelle) = ?', [mb_strtolower($label)])
            ->first();

        if ($ecole) {
            return (int) $ecole->id;
        }

        throw new \RuntimeException("L'école '{$label}' doit être sélectionnée ou créée avant l'import.");
    }

    private function resolveFormationId(?string $label, array $resolvedFormations): ?int
    {
        $label = trim((string) $label);
        if ($label === '') {
            return null;
        }

        if (isset($resolvedFormations[$label])) {
            return (int) $resolvedFormations[$label];
        }

        $formation = Formations::query()
            ->whereRaw('LOWER(libelle) = ?', [mb_strtolower($label)])
            ->first();

        if ($formation) {
            return (int) $formation->id;
        }

        return (int) Formations::create(['libelle' => $label])->id;
    }

    private function resolveEntrepriseId(?string $label, array $resolvedEntreprises): ?int
    {
        $label = trim((string) $label);
        if ($label === '') {
            return null;
        }

        if (isset($resolvedEntreprises[$label])) {
            return (int) $resolvedEntreprises[$label];
        }

        $entreprise = Entreprise::query()
            ->whereRaw('LOWER(raison_sociale) = ?', [mb_strtolower($label)])
            ->first();

        if ($entreprise) {
            return (int) $entreprise->id;
        }

        return (int) Entreprise::create(['raison_sociale' => $label])->id;
    }

    /**
     * Telecharger un fichier CSV exemple.
     */
    public function downloadExemple()
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
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
