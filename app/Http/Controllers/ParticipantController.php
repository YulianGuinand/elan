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
        $status = $request->input('status');
        $perPage = 10;

        $query = Participant::with(['contrats.formation', 'entreprises']);

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

        if ($status && $status !== 'all') {
            $query->where('statut', $status);
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
                'status' => $status ?? 'all',
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
            'statut' => 'required|string',
            'role' => 'required|in:Apprenti,Alumni,Formateur,Employeur',

            // Champs additionnels pour creation inline
            'ecole_id' => 'nullable|string',
            'formation_id' => 'nullable|string',
            'entreprise_id' => 'nullable|string',
            'date_entree' => 'nullable|date',
        ]);

        try {
            $participant = Participant::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'mail' => $validated['mail'],
                'telephone' => $validated['telephone'],
                'statut' => $validated['statut'],
                'role' => $validated['role'],
            ]);

            // Gestion des creations inline pour Apprenti ou Formateur
            if (in_array($validated['role'], ['Apprenti', 'Formateur']) && $request->filled('ecole_id') && $request->filled('formation_id')) {
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
        $participant->load(['contrats.formation', 'entreprises']);
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
            'statut' => 'required|string',
            'role' => 'required|in:Apprenti,Alumni,Formateur,Employeur'
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

            // Creer les participants un par un
            $importedCount = 0;
            foreach ($donnees as $participantData) {
                Participant::create($participantData);
                $importedCount++;
            }

            return redirect()->back()->with('success', "{$importedCount} participant(s) importe(s) avec succès.");
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

        $colonnes = [
            'nom',
            'prenom',
            'mail',
            'telephone',
            'statut',
            'role'
        ];

        $exemple = [
            'Dupont',
            'Jean',
            'jean.dupont@email.com',
            '0612345678',
            'actif',
            'Apprenti'
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
}
