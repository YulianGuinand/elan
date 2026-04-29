<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord avec les statistiques des enquetes
     */
    public function index(): Response
    {
        // Recuperer l'utilisateur connecte
        $user = Auth::user();

        // Calcul du taux de reponse/participation moyen
        // Contacts = nombre d'invitations dans la table participer
        $contactsCount = DB::table('participer')->count();

        // Participations = nombre de participants DISTINCTS ayant répondu
        $participationsCount = DB::table('repondre as r')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->pluck('r.participant_id')
            ->unique()
            ->count();

        // Taux de participation en pourcentage
        $tauxParticipation = $contactsCount > 0
            ? round(($participationsCount / $contactsCount) * 100, 1)
            : 0;

        return Inertia::render('Dashboard', [
            'stats' => $this->getStatsData(),
            'participationData' => $this->getParticipationData(),
            'satisfactionData' => $this->getSatisfactionData(),
            'activeSurveys' => $this->getActiveSurveys(),
            'userName' => $user ? $user->prenom ?? $user->name : '',
            'tauxParticipation' => $tauxParticipation,
        ]);
    }

    /**
     * Recupere les donnees des cartes de statistiques
     */
    private function getStatsData(): array
    {
        $now = now();
        $currentStart = $now->copy()->startOfMonth();
        $currentEnd = $now->copy()->endOfMonth();
        $previousStart = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $previousEnd = $now->copy()->subMonthNoOverflow()->endOfMonth();

        $formatVariation = function (float $current, float $previous, string $unit = '%'): array {
            if ($previous == 0.0) {
                if ($current == 0.0) {
                    return [
                        'change' => 0.0,
                        'text' => 'Aucune donnée disponible',
                    ];
                }

                return [
                    'change' => 100.0,
                    'text' => 'Nouveau ce mois-ci',
                ];
            }

            $delta = round($current - $previous, 2);
            $percent = round(($delta / $previous) * 100, 1);

            if ($percent > 0) {
                return [
                    'change' => $percent,
                    'text' => '+' . $percent . $unit . ' vs mois dernier',
                ];
            }

            if ($percent < 0) {
                return [
                    'change' => $percent,
                    'text' => $percent . $unit . ' vs mois dernier',
                ];
            }

            return [
                'change' => 0.0,
                'text' => 'Pas de changement depuis le mois dernier',
            ];
        };

        // 1) Total enquetes creees (global + variation mensuelle)
        $totalEnquetes = \App\Models\Enquete::count();
        $enquetesCurrentMonth = \App\Models\Enquete::whereBetween('created_at', [$currentStart, $currentEnd])->count();
        $enquetesPreviousMonth = \App\Models\Enquete::whereBetween('created_at', [$previousStart, $previousEnd])->count();
        $enqueteVariation = $formatVariation((float) $enquetesCurrentMonth, (float) $enquetesPreviousMonth);

        // 2) Taux de reponse (participants ayant répondu / participants contactés)
        $participantsContactes = DB::table('participer')->count();
        $participantsRepondus = DB::table('repondre as r')
            ->select('r.participant_id')
            ->distinct()
            ->count('r.participant_id');

        $tauxReponseGlobal = $participantsContactes > 0
            ? round(($participantsRepondus / $participantsContactes) * 100, 1)
            : 0.0;

        // Taux du mois courant
        $participantsContactesCurrentMonth = DB::table('participer')
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->count();
        $participantsReponsCurrentMonth = DB::table('repondre as r')
            ->whereBetween('r.created_at', [$currentStart, $currentEnd])
            ->select('r.participant_id')
            ->distinct()
            ->count('r.participant_id');
        $tauxCurrentMonth = $participantsContactesCurrentMonth > 0
            ? round(($participantsReponsCurrentMonth / $participantsContactesCurrentMonth) * 100, 1)
            : 0.0;

        // Taux du mois précédent
        $participantsContactesPreviousMonth = DB::table('participer')
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();
        $participantsRepondusPreviousMonth = DB::table('repondre as r')
            ->whereBetween('r.created_at', [$previousStart, $previousEnd])
            ->select('r.participant_id')
            ->distinct()
            ->count('r.participant_id');
        $tauxPreviousMonth = $participantsContactesPreviousMonth > 0
            ? round(($participantsRepondusPreviousMonth / $participantsContactesPreviousMonth) * 100, 1)
            : 0.0;

        $tauxDelta = round($tauxCurrentMonth - $tauxPreviousMonth, 1);
        $tauxChangeText = $tauxDelta > 0
            ? '+' . $tauxDelta . ' pts vs mois dernier'
            : ($tauxDelta < 0 ? $tauxDelta . ' pts vs mois dernier' : 'Pas de changement depuis le mois dernier');

        // Statut du taux de réponse
        $typeTaux = 'warning';
        if ($tauxReponseGlobal >= 70) {
            $typeTaux = 'success';
        } elseif ($tauxReponseGlobal >= 50) {
            $typeTaux = 'info';
        }

        // 3) Relances nécessaires (participants contactés mais n'ayant pas répondu)
        $relancesNecessaires = $participantsContactes - $participantsRepondus;

        // Relances du mois courant
        $relancesCurrentMonth = max(0, $participantsContactesCurrentMonth - $participantsReponsCurrentMonth);

        // Relances du mois précédent
        $relancesPreviousMonth = max(0, $participantsContactesPreviousMonth - $participantsRepondusPreviousMonth);

        $relanceVariation = $formatVariation((float) $relancesCurrentMonth, (float) $relancesPreviousMonth);

        // Statut des relances
        $typeRelance = 'info';
        if ($relancesNecessaires === 0) {
            $typeRelance = 'success';
            $relanceChangeText = 'Aucune relance nécessaire';
        } elseif ($relancesNecessaires > 20) {
            $typeRelance = 'warning';
            $relanceChangeText = $relanceVariation['text'];
        } else {
            $relanceChangeText = $relanceVariation['text'];
        }

        return [
            [
                'id' => '1',
                'title' => 'Enquêtes Créées',
                'value' => $totalEnquetes,
                'change' => $enqueteVariation['change'],
                'changeText' => $enqueteVariation['text'],
                'icon' => 'send',
                'type' => 'info',
                'description' => 'Nombre total d\'enquêtes créées dans le système',
            ],
            [
                'id' => '2',
                'title' => 'Taux de Réponse',
                'value' => $tauxReponseGlobal . '%',
                'change' => $tauxDelta,
                'changeText' => $tauxChangeText,
                'icon' => 'response',
                'type' => $typeTaux,
                'description' => $participantsRepondus . ' participants ont répondu sur ' . $participantsContactes . ' contactés',
            ],
            [
                'id' => '3',
                'title' => 'Participants à Relancer',
                'value' => $relancesNecessaires,
                'change' => $relanceVariation['change'],
                'changeText' => $relanceChangeText,
                'icon' => 'alert',
                'type' => $typeRelance,
                'description' => $relancesNecessaires === 0
                    ? 'Excellent ! Tous les participants ont répondu'
                    : 'Nombre de participants n\'ayant pas encore répondu',
            ],
        ];
    }

    /**
     * Recupere les donnees de participation
     */
    private function getParticipationData(): array
    {
        return [
            'percentage' => 85,
            'channelName' => 'Enquetes Telephoniques',
            'channelSubtitle' => 'Canal A fort engagement',
        ];
    }

    /**
     * Recupere les donnees de satisfaction globale (mois courant)
     */
    private function getSatisfactionData(): array
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        // Récupérer toutes les réponses Likert du mois courant
        $satisfactionValues = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('type__reponses as tr', 'tr.id', '=', 'q.type_reponse_id')
            ->whereBetween('r.created_at', [$monthStart, $monthEnd])
            ->where('tr.libelle', '=', 'likert')
            ->select('r.valeur', 'q.id as question_id')
            ->get();

        // Calculer les positions
        $positions = $satisfactionValues->map(function ($row) {
            return DB::table('choixes')
                ->where('question_id', $row->question_id)
                ->where('id', '<=', $row->valeur)
                ->count();
        })->filter(fn($value) => $value !== null);

        if ($positions->isEmpty()) {
            return [
                'score' => 0,
                'maxScore' => 5,
                'levels' => [
                    ['label' => 'Très Satisfait', 'count' => 0, 'color' => '#F18628'],
                    ['label' => 'Satisfait', 'count' => 0, 'color' => '#F18628'],
                    ['label' => 'Neutre', 'count' => 0, 'color' => '#FFA85C'],
                    ['label' => 'Insatisfait', 'count' => 0, 'color' => '#FFD4B3'],
                    ['label' => 'Très Mauvais', 'count' => 0, 'color' => '#FFE8D9'],
                ],
            ];
        }

        $avgScore = round($positions->avg(), 2);

        // Compter la distribution par niveau
        $level5 = $positions->filter(fn($v) => $v == 5)->count();
        $level4 = $positions->filter(fn($v) => $v == 4)->count();
        $level3 = $positions->filter(fn($v) => $v == 3)->count();
        $level2 = $positions->filter(fn($v) => $v == 2)->count();
        $level1 = $positions->filter(fn($v) => $v == 1)->count();

        return [
            'score' => $avgScore,
            'maxScore' => 5,
            'levels' => [
                ['label' => 'Très Satisfait', 'count' => $level5, 'color' => '#F18628'],
                ['label' => 'Satisfait', 'count' => $level4, 'color' => '#F18628'],
                ['label' => 'Neutre', 'count' => $level3, 'color' => '#FFA85C'],
                ['label' => 'Insatisfait', 'count' => $level2, 'color' => '#FFD4B3'],
                ['label' => 'Très Mauvais', 'count' => $level1, 'color' => '#FFE8D9'],
            ],
        ];
    }

    /**
     * Recupere la liste des enquetes actives
     */
    private function getActiveSurveys(): array
    {
        $now = now();

        return \App\Models\Enquete::where(function ($q) use ($now) {
            $q->whereNull('date_debut')->orWhere('date_debut', '<=', $now);
        })
            ->where(function ($q) use ($now) {
                $q->whereNull('date_fin')->orWhere('date_fin', '>=', $now);
            })
            ->orderByRaw('date_fin IS NULL ASC')
            ->orderBy('date_fin', 'asc')
            ->take(3)
            ->get()
            ->values()
            ->map(function ($enquete) {
                return [
                    'id' => (string) $enquete->id,
                    'name' => $enquete->titre,
                    'subtitle' => $enquete->type_campagne ?? null,
                    'endDate' => $enquete->date_fin
                        ? $enquete->date_fin->format('d/m/Y')
                        : 'Sans date de fin',
                    'status' => 'active',
                ];
            })
            ->toArray();
    }
}
