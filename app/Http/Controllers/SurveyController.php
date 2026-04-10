<?php

namespace App\Http\Controllers;

use App\Events\ResponseReceived;
use App\Events\SurveyCreated;
use App\Models\Enquete;
use App\Models\Participant;
use App\Models\Question;
use App\Models\Theme;
use App\Models\Type_Reponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Information;
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

        $enquetes = Enquete::with(['utilisateur', 'questions.type_reponse', 'questions.theme', 'questions.choix'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn(Enquete $e) => $this->formatEnquete($e));

        $stats = [
            'total' => $enquetes->count(),
            'active' => $enquetes->where('statut', 'active')->count(),
            'terminee' => $enquetes->where('statut', 'terminee')->count(),
            'a_venir' => $enquetes->where('statut', 'a_venir')->count(),
        ];

        $auteurs = \App\Models\Utilisateur::whereHas('enquetes')
            ->get(['id', 'nom', 'prenom'])
            ->map(fn($u) => ['id' => $u->id, 'nom' => $u->nom, 'prenom' => $u->prenom]);

        return Inertia::render('Surveys', [
            'stats' => $stats,
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
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'type_campagne' => 'required|string|max:100',
            'questions' => 'nullable|array',
            'questions.*.libelle' => 'required|string',
            'questions.*.numero' => 'required|integer',
            'questions.*.type_reponse_id' => 'required|exists:type__reponses,id',
            'questions.*.theme_id' => 'nullable|exists:themes,id',
            'questions.*.likert_style' => 'nullable|in:emoji,custom',
            'questions.*.choix' => 'nullable|array',
            'questions.*.choix.*' => 'string',
            'questions.*.themeId' => 'string',
            'themes' => 'required|array',
        ]);

        return DB::transaction(function () use ($validated) {
            $enquete = Enquete::create([
                'titre' => $validated['titre'],
                'description' => $validated['description'] ?? '',
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'type_campagne' => $validated['type_campagne'],
                'utilisateur_id' => Auth::id(),
            ]);

            $participants = Participant::whereAll(['role'], '=', $enquete->type_campagne)->get();

            foreach ($participants as $participant) {
                $token = Str::uuid();
                $enquete->participants()->attach($participant->id, ['jeton' => $token]);
            }

            $now = now();

            $themesMapping = [];
            foreach ($validated['themes'] as $t) {
                $theme = Theme::create([
                    'libelle' => $t['libelle'],
                    'ordre' => $t['ordre'],
                ]);
                $themesMapping[$t['_id']] = $theme->id;
            }

            $questionsData = [];
            foreach ($validated['questions'] ?? [] as $question) {
                $questionsData[] = [
                    'enquete_id' => $enquete->id,
                    'libelle' => $question['libelle'],
                    'numero' => $question['numero'],
                    'type_reponse_id' => $question['type_reponse_id'],
                    'theme_id' => $themesMapping[$question['themeId']] ?? null,
                    'likert_style' => $question['likert_style'] ?? 'emoji',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            Question::insert($questionsData);

            $insertedQuestions = Question::where('enquete_id', $enquete->id)->get()->keyBy(function ($q) {
                return $q->numero . '|' . $q->libelle;
            });

            $choicesData = [];
            foreach ($validated['questions'] ?? [] as $question) {
                $key = $question['numero'] . '|' . $question['libelle'];
                $questionId = $insertedQuestions->get($key)?->id;

                if ($questionId && ! empty($question['choix'])) {
                    foreach ($question['choix'] as $choixLibelle) {
                        $choicesData[] = [
                            'question_id' => $questionId,
                            'libelle' => $choixLibelle,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }
            }

            if (! empty($choicesData)) {
                \App\Models\Choix::insert($choicesData);
            }

            // Dispatcher l'événement de création d'enquête
            event(new SurveyCreated($enquete));

            return redirect()->route('surveys.index')
                ->with('success', 'Enquête créée avec succes.');
        });
    }

    /**
     * Formulaire de modification.
     */
    public function edit(string $id): Response
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::with(['questions.type_reponse', 'questions.choix', 'questions.theme'])
            ->where('id', $id);

        if (! $user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        $typesReponse = Type_Reponse::all(['id', 'libelle']);

        return Inertia::render('Surveys/Edit', [
            'enquete' => $this->formatEnquete($enquete->load(['questions.type_reponse', 'questions.choix', 'questions.theme'])),
            'typesReponse' => $typesReponse,
        ]);
    }

    /**
     * Met a jour une enquete (ses propres uniquement).
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::where('id', $id);

        if (! $user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'type_campagne' => 'required|string|max:100',
            'questions' => 'nullable|array',
            'questions.*.libelle' => 'required|string',
            'questions.*.numero' => 'required|integer',
            'questions.*.type_reponse_id' => 'required|exists:type__reponses,id',
            'questions.*.theme_id' => 'nullable|exists:themes,id',
            'questions.*.likert_style' => 'nullable|in:emoji,custom',
            'questions.*.choix' => 'nullable|array',
            'questions.*.choix.*' => 'string',
            'questions.*.themeId' => 'nullable|string',
            'themes' => 'required|array',
        ]);

        return DB::transaction(function () use ($validated, $enquete) {
            $enquete->update([
                'titre' => $validated['titre'],
                'description' => $validated['description'] ?? '',
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'type_campagne' => $validated['type_campagne'],
            ]);

            $now = now();

            $oldThemeIds = $enquete->questions()->pluck('theme_id')->unique()->filter()->toArray();
            $enquete->questions()->delete();
            if (! empty($oldThemeIds)) {
                Theme::whereIn('id', $oldThemeIds)->delete();
            }

            $themesMapping = [];
            foreach ($validated['themes'] as $t) {
                $theme = Theme::create([
                    'libelle' => $t['libelle'],
                    'ordre' => $t['ordre'],
                ]);
                $themesMapping[$t['_id']] = $theme->id;
            }

            $questionsData = [];
            foreach ($validated['questions'] ?? [] as $q) {
                $questionsData[] = [
                    'enquete_id' => $enquete->id,
                    'libelle' => $q['libelle'],
                    'numero' => $q['numero'],
                    'type_reponse_id' => $q['type_reponse_id'],
                    'theme_id' => $themesMapping[$q['themeId']] ?? null,
                    'likert_style' => $q['likert_style'] ?? 'emoji',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            Question::insert($questionsData);

            $insertedQuestions = Question::where('enquete_id', $enquete->id)->get()->keyBy(function ($q) {
                return $q->numero . '|' . $q->libelle;
            });

            $choicesData = [];
            foreach ($validated['questions'] ?? [] as $q) {
                $key = $q['numero'] . '|' . $q['libelle'];
                $questionId = $insertedQuestions->get($key)?->id;

                if ($questionId && ! empty($q['choix'])) {
                    foreach ($q['choix'] as $choixLibelle) {
                        $choicesData[] = [
                            'question_id' => $questionId,
                            'libelle' => $choixLibelle,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }
            }

            if (! empty($choicesData)) {
                \App\Models\Choix::insert($choicesData);
            }

            return redirect()->route('surveys.index')
                ->with('success', 'Enquête mise à jour avec succes.');
        });
    }

    /**
     * Supprime une enquete (ses propres uniquement).
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::where('id', $id);

        if (! $user->isSuperAdmin()) {
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

        $cible = $enquete->type_campagne;

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('mail', 'like', "%{$search}%");
            });
        }

        $query->where('role', $cible);

        $participants = $query->paginate(5)->withQueryString();

        return Inertia::render('Surveys/Fill', [
            'enquete' => $this->formatEnquete($enquete->load(['questions.type_reponse', 'questions.choix', 'questions.theme'])),
            'participants' => $participants,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'availableRoles' => [$cible],
        ]);
    }

    /**
     * Soumet les reponses d'une enquete.
     */
    public function submitFill(Request $request, string $id)
    {
        $enquete = Enquete::with('questions')->findOrFail($id);
        $user = Auth::user();

        $rules = [
            'participant_id' => 'required|exists:participants,id',
        ];
        foreach ($enquete->questions as $q) {
            $rules["reponses.{$q->id}"] = 'nullable|string';
        }
        $validated = $request->validate($rules);

        // Sauvegarder les réponses dans la table reponses
        return DB::transaction(function () use ($validated, $enquete) {
            $participant = Participant::findOrFail($validated['participant_id']);
            $responseCount = 0;

            foreach ($validated['reponses'] ?? [] as $questionId => $reponse) {
                if ($reponse !== null && $reponse !== '') {
                    $question = $enquete->questions->find($questionId);

                    $question->participants()->attach($participant->id, ['valeur' => $reponse]);

                    $responseCount++;
                }
            }

            if ($responseCount > 0) {
                event(new ResponseReceived($enquete, $responseCount));
            }

            return back()->with('success', 'Vos réponses ont été enregistrées avec succès.');
        });
    }

    /**
     * Permet à un participant de remplir un formulaire
     */
    public function participantFill($jeton)
    {
        $data = Enquete::with([
            'participants' => function ($query) use ($jeton) {
                $query->where('participer.jeton', $jeton);
            },
            'questions.type_reponse',
            'questions.choix',
            'questions.theme',
        ])
            ->whereHas('participants', function ($query) use ($jeton) {
                $query->where('participer.jeton', $jeton);
            })
            ->firstOrFail();

        $participant = $data->participants()->first();

        return Inertia::render('Surveys/Participants/Fill', [
            'nom' => $participant->nom,
            'prenom' => $participant->prenom,
            'telephone' => $participant->telephone,
            'mail' => $participant->mail,
            'enquete' => $this->formatEnquete($data->load(['questions.type_reponse', 'questions.choix', 'questions.theme'])),
            'jeton' => $jeton,
        ]);
    }

    /**
     * Traite la soumission de l'enquête par un participant.
     */
    public function submitFillPublic(Request $request, $jeton)
    {
        dd($request->all(), $jeton);

        $participant = Participant::whereHas('enquetes', function ($query) use ($jeton) {
            $query->where('participer.jeton', $jeton);
        })->firstOrFail();

        $validated = $request->validate([
            'reponses' => 'required|array',
            'reponses.*.question_id' => 'required|exists:questions,id',
            'reponses.*.valeur' => 'required',
        ]);

        DB::transaction(function () use ($validated, $participant) {
            foreach ($validated['reponses'] as $reponseData) {
                \App\Models\Reponse::updateOrCreate(
                    [
                        'question_id' => $reponseData['question_id'],
                        'participant_id' => $participant->id,
                    ],
                    ['valeur' => is_array($reponseData['valeur']) ? json_encode($reponseData['valeur']) : $reponseData['valeur']]
                );
            }
        });

        return redirect()->route('welcome')->with('success', 'Merci pour votre participation !');
    }

    // ─────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────

    private function formatChoixWithEmojis($choixCollection, $typeReponseLibelle, $likertStyle)
    {
        $choix = $choixCollection->map(fn($c) => ['id' => $c->id, 'libelle' => $c->libelle])->toArray();

        $typeReponseLibelle = strtolower($typeReponseLibelle ?? '');

        if (strpos($typeReponseLibelle, 'likert') !== false && $likertStyle === 'emoji') {
            $emojiSequence = ['😠', '😕', '😐', '🙂', '😍'];

            $choix = array_map(function ($c, $index) use ($emojiSequence) {
                return [
                    'id' => $c['id'],
                    'libelle' => $c['libelle'],
                    'emoji' => $emojiSequence[$index] ?? '😐',
                ];
            }, $choix, array_keys($choix));
        }

        return $choix;
    }

    private function formatEnquete(Enquete $e): array
    {
        if (! $e->relationLoaded('questions')) {
            $e->load(['questions.type_reponse', 'questions.choix', 'questions.theme']);
        }

        $questions = $e->questions->map(function (Question $q) {
            $theme = $q->theme;

            return [
                'id' => $q->id,
                'libelle' => $q->libelle,
                'numero' => $q->numero,
                'type_reponse' => $q->type_reponse?->libelle,
                'type_reponse_id' => $q->type_reponse_id,
                'choix' => $this->formatChoixWithEmojis($q->choix ?: new \Illuminate\Database\Eloquent\Collection, $q->type_reponse?->libelle, $q->likert_style),
                'likert_style' => $q->likert_style ?? 'emoji',
                'theme' => $theme ? [
                    'id' => $theme->id,
                    'libelle' => $theme->libelle,
                    'ordre' => $theme->ordre ?? 0,
                ] : null,
            ];
        })->values()->toArray();

        $themesMap = [];
        $noThemeQuestions = [];

        foreach ($questions as $q) {
            if ($q['theme']) {
                $tId = $q['theme']['id'];
                if (! isset($themesMap[$tId])) {
                    $themesMap[$tId] = [
                        'id' => $q['theme']['id'],
                        'libelle' => $q['theme']['libelle'],
                        'ordre' => $q['theme']['ordre'] ?? 0,
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

        if (! empty($noThemeQuestions)) {
            $formattedThemes[] = [
                'id' => 0,
                'libelle' => 'Questions Générales',
                'ordre' => 999,
                'questions' => $noThemeQuestions,
            ];
        }

        return [
            'id' => $e->id,
            'titre' => $e->titre,
            'description' => $e->description,
            'date_debut' => $e->date_debut?->format('d/m/Y'),
            'date_fin' => $e->date_fin?->format('d/m/Y'),
            'type_campagne' => $e->type_campagne,
            'statut' => $e->statut,
            'utilisateur' => $e->utilisateur?->name ?? '—',
            'utilisateur_id' => $e->utilisateur_id,
            'nb_questions' => $e->questions?->count() ?? 0,
            'created_at' => $e->created_at?->format('d/m/Y'),
            'questions' => $e->relationLoaded('questions')
                ? $e->questions->map(fn(Question $q) => [
                    'id' => $q->id,
                    'libelle' => $q->libelle,
                    'numero' => $q->numero,
                    'type_reponse' => $q->type_reponse?->libelle,
                    'type_reponse_id' => $q->type_reponse_id,
                    'likert_style' => $q->likert_style ?? 'emoji',
                    'theme' => $q->theme ? [
                        'id' => $q->theme->id,
                        'libelle' => $q->theme->libelle,
                        'ordre' => $q->theme->ordre,
                    ] : null,
                    'choix' => $this->formatChoixWithEmojis(
                        $q->relationLoaded('choix') ? $q->choix : collect([]),
                        $q->type_reponse?->libelle,
                        $q->likert_style
                    ),
                ])->values()
                : [],
            'themes' => $e->relationLoaded('questions')
                ? $e->questions->groupBy('theme_id')->map(function ($questions) {
                    $theme = $questions->first()->theme;

                    return [
                        'id' => $theme ? $theme->id : null,
                        'libelle' => $theme ? $theme->libelle : 'Sans theme',
                        'ordre' => $theme ? $theme->ordre : 0,
                        'questions' => $questions->map(fn($q) => [
                            'id' => $q->id,
                            'libelle' => $q->libelle,
                            'numero' => $q->numero,
                            'type_reponse' => $q->type_reponse?->libelle,
                            'type_reponse_id' => $q->type_reponse_id,
                            'likert_style' => $q->likert_style ?? 'emoji',
                            'choix' => $this->formatChoixWithEmojis(
                                $q->choix,
                                $q->type_reponse?->libelle,
                                $q->likert_style
                            ),
                        ])->values(),
                    ];
                })->values()
                : [],
        ];
    }

    /**
     * Duplique une enquête (ses propres uniquement).
     */
    public function duplicate(string $id)
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::with(['questions.choix', 'questions.theme'])
            ->where('id', $id);

        if (! $user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        // Créer une copie de l'enquête
        $newEnquete = $enquete->replicate();
        $newEnquete->titre = $enquete->titre . ' (copie)';
        $newEnquete->save();

        // Dupliquer les thèmes et questions
        foreach ($enquete->questions as $question) {
            $newQuestion = $question->replicate();
            $newQuestion->enquete_id = $newEnquete->id;
            $newQuestion->save();

            // Dupliquer les choix
            foreach ($question->choix as $choix) {
                $newChoix = $choix->replicate();
                $newChoix->question_id = $newQuestion->id;
                $newChoix->save();
            }
        }

        return redirect()->route('surveys.index')
            ->with('success', 'Enquête dupliquée avec succès.');
    }

    /**
     * Affiche les réponses d'une enquête.
     */
    public function responses(string $id): Response
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::with(['questions.choix', 'questions.type_reponse'])
            ->where('id', $id);

        if (! $user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }

        $enquete = $enqueteQuery->firstOrFail();

        // Récupérer les réponses avec les participants
        $reponses = \App\Models\Reponse::where('enquete_id', $enquete->id)
            ->with(['participant', 'question'])
            ->orderBy('created_at', 'desc')
            ->paginate(config('pagination.per_page'));

        return Inertia::render('Surveys/Responses', [
            'enquete' => $this->formatEnquete($enquete),
            'reponses' => $reponses,
        ]);
    }

    public function informations(string $id): Response
    {
        $user = Auth::user();
        $enqueteQuery = Enquete::with(['questions.choix', 'questions.type_reponse'])
            ->where('id', $id);


        if (! $user->isSuperAdmin()) {
            $enqueteQuery->where('utilisateur_id', $user->id);
        }
        $enquete = $enqueteQuery->firstOrFail();
        $participantQuery = Participant::where('role', $enquete->type_campagne)->get();


        return Inertia::render('Surveys/ViewInformations', [
            'enquete' => $this->formatEnquete($enquete),
            'participants' => $participantQuery,
        ]);
    }
}
