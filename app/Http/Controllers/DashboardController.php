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
        $totalEnquetes = \App\Models\Enquete::count();
        $totalParticipations = DB::table('participer')->count();
        $tauxParticipation = $totalEnquetes > 0 ? round($totalParticipations / $totalEnquetes, 2) : 0;

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
                        'text' => 'Aucune evolution par rapport au mois dernier',
                    ];
                }

                return [
                    'change' => 100.0,
                    'text' => 'Nouveau ce mois-ci (pas de reference le mois dernier)',
                ];
            }

            $delta = round($current - $previous, 2);
            $percent = round(($delta / $previous) * 100, 1);

            if ($percent > 0) {
                return [
                    'change' => $percent,
                    'text' => '+'.$percent.$unit.' vs mois dernier',
                ];
            }

            if ($percent < 0) {
                return [
                    'change' => $percent,
                    'text' => $percent.$unit.' vs mois dernier',
                ];
            }

            return [
                'change' => 0.0,
                'text' => 'Stable vs mois dernier',
            ];
        };

        // 1) Total enquetes envoyees (global + variation mensuelle)
        $totalEnquetes = \App\Models\Enquete::count();
        $enquetesCurrentMonth = \App\Models\Enquete::whereBetween('created_at', [$currentStart, $currentEnd])->count();
        $enquetesPreviousMonth = \App\Models\Enquete::whereBetween('created_at', [$previousStart, $previousEnd])->count();
        $enqueteVariation = $formatVariation((float) $enquetesCurrentMonth, (float) $enquetesPreviousMonth, '%');

        // 2) Taux de reponse moyen (participations / contacts)
        $contactsTotal = DB::table('contacter')->count();
        $participationsTotal = DB::table('participer')->count();
        $tauxParticipation = $contactsTotal > 0
            ? round(($participationsTotal / $contactsTotal) * 100, 1)
            : 0.0;

        $contactsCurrentMonth = DB::table('contacter')
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->count();
        $participationsCurrentMonth = DB::table('participer')
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->count();
        $tauxCurrentMonth = $contactsCurrentMonth > 0
            ? round(($participationsCurrentMonth / $contactsCurrentMonth) * 100, 1)
            : 0.0;

        $contactsPreviousMonth = DB::table('contacter')
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();
        $participationsPreviousMonth = DB::table('participer')
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();
        $tauxPreviousMonth = $contactsPreviousMonth > 0
            ? round(($participationsPreviousMonth / $contactsPreviousMonth) * 100, 1)
            : 0.0;

        $tauxDelta = round($tauxCurrentMonth - $tauxPreviousMonth, 1);
        $tauxChangeText = $tauxDelta > 0
            ? '+'.$tauxDelta.' pts vs mois dernier'
            : ($tauxDelta < 0 ? $tauxDelta.' pts vs mois dernier' : 'Stable vs mois dernier');

        $typeTaux = 'info';
        if ($tauxParticipation < 40) {
            $typeTaux = 'warning';
        } elseif ($tauxParticipation >= 70) {
            $typeTaux = 'success';
        }

        // 3) Relances en attente (contactes mais sans participation)
        $relancesEnAttente = DB::table('contacter as c')
            ->leftJoin('participer as p', function ($join) {
                $join->on('c.participant_id', '=', 'p.participant_id')
                    ->on('c.enquete_id', '=', 'p.enquete_id');
            })
            ->whereNull('p.id')
            ->count();

        $relancesCurrentMonth = DB::table('contacter as c')
            ->leftJoin('participer as p', function ($join) {
                $join->on('c.participant_id', '=', 'p.participant_id')
                    ->on('c.enquete_id', '=', 'p.enquete_id');
            })
            ->whereBetween('c.created_at', [$currentStart, $currentEnd])
            ->whereNull('p.id')
            ->count();

        $relancesPreviousMonth = DB::table('contacter as c')
            ->leftJoin('participer as p', function ($join) {
                $join->on('c.participant_id', '=', 'p.participant_id')
                    ->on('c.enquete_id', '=', 'p.enquete_id');
            })
            ->whereBetween('c.created_at', [$previousStart, $previousEnd])
            ->whereNull('p.id')
            ->count();

        $relanceVariation = $formatVariation((float) $relancesCurrentMonth, (float) $relancesPreviousMonth, '%');
        $relanceChangeText = $relancesEnAttente === 0
            ? 'Aucune relance necessaire actuellement'
            : $relanceVariation['text'];

        return [
            [
                'id' => '1',
                'title' => 'Total Enquetes Envoyees',
                'value' => $totalEnquetes,
                'change' => $enqueteVariation['change'],
                'changeText' => $enqueteVariation['text'],
                'icon' => 'send',
                'type' => 'info',
            ],
            [
                'id' => '2',
                'title' => 'Taux de Reponse Moyen',
                'value' => $tauxParticipation.'%',
                'change' => $tauxDelta,
                'changeText' => $tauxChangeText,
                'icon' => 'response',
                'type' => $typeTaux,
            ],
            [
                'id' => '3',
                'title' => 'Relances en Attente',
                'value' => $relancesEnAttente,
                'change' => $relanceVariation['change'],
                'changeText' => $relanceChangeText,
                'icon' => 'alert',
                'type' => ($relancesEnAttente == 0 ? 'success' : 'warning'),
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
     * Recupere les donnees de satisfaction globale
     */
    private function getSatisfactionData(): array
    {
        return [
            'score' => 4.2,
            'maxScore' => 5,
            'levels' => [
                ['label' => 'Tres Satisfait', 'percentage' => 40, 'color' => '#F18628'],
                ['label' => 'Satisfait', 'percentage' => 30, 'color' => '#F18628'],
                ['label' => 'Neutre', 'percentage' => 20, 'color' => '#FFA85C'],
                ['label' => 'Insatisfait', 'percentage' => 7, 'color' => '#FFD4B3'],
                ['label' => 'Tres Mauvais', 'percentage' => 3, 'color' => '#FFE8D9'],
            ],
        ];
    }

    /**
     * Recupere la liste des enquetes actives
     */
    private function getActiveSurveys(): array
    {
        return [
            [
                'id' => '1',
                'name' => 'Retour Apprentis Q1',
                'subtitle' => 'Classe 2023-A',
                'endDate' => '15 Oct 2023',
                'status' => 'active',
            ],
            [
                'id' => '2',
                'name' => 'Satisfaction Formateurs',
                'subtitle' => 'Tous departements',
                'endDate' => '20 Oct 2023',
                'status' => 'active',
            ],
            [
                'id' => '3',
                'name' => 'evaluation Entreprises',
                'subtitle' => 'Partenaires 2023',
                'endDate' => '25 Oct 2023',
                'status' => 'active',
            ],
        ];
    }
}
