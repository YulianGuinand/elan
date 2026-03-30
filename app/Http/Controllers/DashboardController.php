<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

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
        // Dynamique :
        $totalEnquetes = \App\Models\Enquete::count();
        $totalParticipations = DB::table('participer')->count();
        // Taux de participation moyen par enquête
        $tauxParticipation = $totalEnquetes > 0 ? round($totalParticipations / $totalEnquetes, 2) : 0;
        // Relances en attente = participations sans aucune réponse à une question de l'enquête
        $relancesEnAttente = DB::table('participer')
            ->leftJoin('questions', 'participer.enquete_id', '=', 'questions.enquete_id')
            ->leftJoin('repondre', function($join) {
                $join->on('participer.participant_id', '=', 'repondre.participant_id')
                     ->on('questions.id', '=', 'repondre.question_id');
            })
            ->whereNull('repondre.question_id')
            ->select('participer.participant_id', 'participer.enquete_id')
            ->distinct()
            ->count();

        // Détermination du type pour le taux de réponse
        $typeTaux = null;
        if ($tauxParticipation < 30) {
            $typeTaux = 'warning';
        } elseif ($tauxParticipation > 70) {
            $typeTaux = 'success';
        }

        return [
            [
                'id' => '1',
                'title' => 'Total Enquetes Envoyees',
                'value' => $totalEnquetes,
                'change' => null,
                'changeText' => null,
                'icon' => 'send',
                'type' => 'info',
            ],
            [
                'id' => '2',
                'title' => 'Taux de Reponse Moyen',
                'value' => $tauxParticipation,
                'change' => null,
                'changeText' => null,
                'icon' => 'response',
                'type' => $typeTaux,
            ],
            [
                'id' => '3',
                'title' => 'Relances en Attente',
                'value' => $relancesEnAttente,
                'change' => null,
                'changeText' => null,
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
