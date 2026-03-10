<?php

namespace App\Http\Controllers;

use App\Models\Enquete;
use App\Models\Question;
use App\Models\Type_Reponse;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    /**
     * Liste de toutes les enquetes (admin/superadmin)
     * ou uniquement celles de l'utilisateur connecte.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $enquetes = Enquete::with(['utilisateur', 'questions.theme'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn(Enquete $e) => $this->formatEnquete($e));

        $stats = [
            'total'             => $enquetes->count(),
            'active'            => $enquetes->where('statut', 'active')->count(),
            'terminee'          => $enquetes->where('statut', 'terminee')->count(),
            'a_venir'           => $enquetes->where('statut', 'a_venir')->count(),
        ];

        $auteurs = \App\Models\Utilisateur::whereHas('enquetes')
            ->get(['id', 'nom', 'prenom'])
            ->map(fn($u) => ['id' => $u->id, 'nom' => $u->nom, 'prenom' => $u->prenom]);

        return Inertia::render('Surveys', [
            'stats'   => $stats,
            'surveys' => $enquetes->values(),
            'userRole' => $user ? $user->role : 'utilisateur',
            'userId' => $user ? $user->id : null,
            'auteurs' => $auteurs,
        ]);
    }

    /**
     * Formulaire de creation.
     */
    public function create(): Response
    {
        $typesReponse = Type_Reponse::all(['id', 'libelle']);
        return Inertia::render('CreateSurvey', [
            'typesReponse' => $typesReponse,
        ]);
    }

    /**
     * Persiste l'enquete depuis le builder.
     */
    public function storeFromBuilder(Request $request)
    {
        $validated = $request->validate([
            'titre'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'date_debut'    => 'required|date',
            'date_fin'      => 'required|date|after_or_equal:date_debut',
            'type_campagne' => 'required|string|max:100',
            'questions'     => 'nullable|array',
            'questions.*.libelle'         => 'required|string',
            'questions.*.numero'          => 'required|integer',
            'questions.*.type_reponse_id' => 'required|exists:type__reponses,id',
            'questions.*.theme_id'        => 'nullable|exists:themes,id',
            'questions.*.choix'           => 'nullable|array',
            'questions.*.choix.*'         => 'string',
        ]);

        $enquete = Enquete::create([
            'titre'          => $validated['titre'],
            'description'    => $validated['description'] ?? '',
            'date_debut'     => $validated['date_debut'],
            'date_fin'       => $validated['date_fin'],
            'type_campagne'  => $validated['type_campagne'],
            'utilisateur_id' => Auth::id(),
        ]);

        foreach ($validated['questions'] ?? [] as $q) {
            $question = $enquete->questions()->create([
                'libelle'         => $q['libelle'],
                'numero'          => $q['numero'],
                'type_reponse_id' => $q['type_reponse_id'],
                'theme_id'        => $q['theme_id'] ?? null,
            ]);

            if (!empty($q['choix'])) {
                foreach ($q['choix'] as $choixLibelle) {
                    $question->choix()->create(['libelle' => $choixLibelle]);
                }
            }
        }

        return redirect()->route('surveys.index')
            ->with('success', 'Enquête créée avec succès.');
    }

    /**
     * Formulaire de modification.
     */
    public function edit(string $id): Response
    {
        $user    = Auth::user();
        $enqueteQuery = Enquete::with(['questions.type_reponse', 'questions.choix', 'questions.theme'])
            ->where('id', $id);

        if (!$user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id); // admin modifies only their own
        }

        $enquete = $enqueteQuery->firstOrFail();

        $typesReponse = Type_Reponse::all(['id', 'libelle']);

        return Inertia::render('Surveys/Edit', [
            'enquete'      => $this->formatEnquete($enquete),
            'typesReponse' => $typesReponse,
        ]);
    }

    /**
     * Met a jour une enquete (ses propres uniquement).
     */
    public function update(Request $request, string $id)
    {
        $user    = Auth::user();
        $enqueteQuery = Enquete::where('id', $id);

        if (!$user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        $validated = $request->validate([
            'titre'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'date_debut'    => 'required|date',
            'date_fin'      => 'required|date|after_or_equal:date_debut',
            'type_campagne' => 'required|string|max:100',
            'questions'     => 'nullable|array',
            'questions.*.libelle'         => 'required|string',
            'questions.*.numero'          => 'required|integer',
            'questions.*.type_reponse_id' => 'required|exists:type__reponses,id',
            'questions.*.theme_id'        => 'nullable|exists:themes,id',
            'questions.*.choix'           => 'nullable|array',
            'questions.*.choix.*'         => 'string',
        ]);

        $enquete->update([
            'titre'         => $validated['titre'],
            'description'   => $validated['description'] ?? '',
            'date_debut'    => $validated['date_debut'],
            'date_fin'      => $validated['date_fin'],
            'type_campagne' => $validated['type_campagne'],
        ]);

        // Pour simplifier, on supprime et recrée les questions (en cascade via foreign keys, les choix associés seront supprimés)
        $enquete->questions()->delete();

        foreach ($validated['questions'] ?? [] as $q) {
            $question = $enquete->questions()->create([
                'libelle'         => $q['libelle'],
                'numero'          => $q['numero'],
                'type_reponse_id' => $q['type_reponse_id'],
                'theme_id'        => $q['theme_id'] ?? null,
            ]);

            if (!empty($q['choix'])) {
                foreach ($q['choix'] as $choixLibelle) {
                    $question->choix()->create(['libelle' => $choixLibelle]);
                }
            }
        }

        // Nettoyage des thèmes sans questions
        \App\Models\Theme::doesntHave('questions')->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Enquête mise à jour avec succès.');
    }

    /**
     * Supprime une enquete (ses propres uniquement).
     */
    public function destroy(string $id)
    {
        $user    = Auth::user();
        $enqueteQuery = Enquete::where('id', $id);

        if (!$user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        $enquete->delete();

        // Nettoyage des thèmes orphelins après suppression de l'enquête
        \App\Models\Theme::doesntHave('questions')->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Enquête supprimée.');
    }

    /**
     * Supprime TOUTES les enquetes (admin uniquement).
     */
    public function destroyAll()
    {
        $user = Auth::user();

        // Seuls les superadmins accedent à cette méthode (via le middleware), donc clean everything
        Enquete::query()->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Toutes vos enquêtes ont été supprimées.');
    }

    /**
     * Affiche le formulaire de remplissage avec les vraies questions.
     */
    public function fill(Request $request, string $id): Response
    {
        $enquete = Enquete::with(['questions.type_reponse', 'questions.choix', 'questions.theme'])
            ->findOrFail($id);

        $search = $request->input('search');
        $roleFilter = $request->input('role', 'Tous');

        $query = Participant::with('entreprises');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('mail', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== 'Tous') {
            $query->where('role', $roleFilter);
        }

        $participants = $query->paginate(5)->withQueryString();

        // On récupère tous les rôles uniques pour les filtres
        $allRoles = Participant::distinct()->pluck('role')->filter()->values();

        return Inertia::render('Surveys/Fill', [
            'enquete' => $this->formatEnquete($enquete),
            'participants' => $participants,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'availableRoles' => $allRoles,
        ]);
    }

    /**
     * Soumet les reponses d'une enquete.
     */
    public function submitFill(Request $request, string $id)
    {
        $enquete = Enquete::with('questions')->findOrFail($id);
        $user    = Auth::user();

        // Validation dynamique : une reponse par question
        $rules = [
            'participant_id' => 'required|exists:participants,id',
        ];
        foreach ($enquete->questions as $q) {
            $rules["reponses.{$q->id}"] = 'nullable|string';
        }
        $validated = $request->validate($rules);

        // Visuel → dd() pour l'instant (pas de table reponses en BDD)
        dd([
            'action'         => 'Soumettre réponses enquête',
            'enquete_id'     => $id,
            'enquete_titre'  => $enquete->titre,
            'utilisateur_id' => $user?->id,
            'participant_id' => $validated['participant_id'],
            'reponses'       => $validated['reponses'] ?? [],
        ]);
    }

    // ─────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────

    private function formatEnquete(Enquete $e): array
    {
        $questions = $e->relationLoaded('questions')
            ? $e->questions->map(function (Question $q) {
                $theme = $q->theme;
                return [
                    'id'            => $q->id,
                    'libelle'       => $q->libelle,
                    'numero'        => $q->numero,
                    'type_reponse'  => $q->type_reponse?->libelle,
                    'type_reponse_id' => $q->type_reponse_id,
                    'choix'         => $q->relationLoaded('choix')
                        ? $q->choix->map(fn($c) => ['id' => $c->id, 'libelle' => $c->libelle])
                        : [],
                    'theme'         => $theme ? [
                        'id'      => $theme->id,
                        'libelle' => $theme->libelle,
                        'ordre'   => $theme->ordre ?? 0,
                    ] : null,
                ];
            })->values()->toArray()
            : [];

        // Grouper les questions par thèmes pour la navigation par étapes
        $themesMap = [];
        $noThemeQuestions = [];

        foreach ($questions as $q) {
            if ($q['theme']) {
                $tId = $q['theme']['id'];
                if (!isset($themesMap[$tId])) {
                    $themesMap[$tId] = [
                        'id'        => $q['theme']['id'],
                        'libelle'   => $q['theme']['libelle'],
                        'ordre'     => $q['theme']['ordre'] ?? 0,
                        'questions' => [],
                    ];
                }
                $themesMap[$tId]['questions'][] = $q;
            } else {
                $noThemeQuestions[] = $q;
            }
        }

        $formattedThemes = array_values($themesMap);
        usort($formattedThemes, fn($a, $b) => $a['ordre'] <=> $b['ordre']);

        // Si des questions n'ont pas de thème, on les met dans un thème par défaut à la fin
        if (!empty($noThemeQuestions)) {
            $formattedThemes[] = [
                'id'        => 0,
                'libelle'   => 'Questions Générales',
                'ordre'     => 999,
                'questions' => $noThemeQuestions,
            ];
        }

        return [
            'id'            => $e->id,
            'titre'         => $e->titre,
            'description'   => $e->description,
            'date_debut'    => $e->date_debut?->format('d/m/Y'),
            'date_fin'      => $e->date_fin?->format('d/m/Y'),
            'type_campagne' => $e->type_campagne,
            'statut'        => $e->statut,
            'utilisateur'   => $e->utilisateur?->name ?? '—',
            'utilisateur_id' => $e->utilisateur_id,
            'nb_questions'  => count($questions),
            'questions'     => $questions,
            'themes'        => $formattedThemes,
            'created_at'    => $e->created_at?->format('d/m/Y'),
        ];
    }
}
