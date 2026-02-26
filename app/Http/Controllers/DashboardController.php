<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord avec les statistiques des enquetes
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => $this->getStatsData(),
            'participationData' => $this->getParticipationData(),
            'satisfactionData' => $this->getSatisfactionData(),
            'activeSurveys' => $this->getActiveSurveys(),
        ]);
    }

    /**
     * Recupere les donnees des cartes de statistiques
     */
    private function getStatsData(): array
    {
        return [
            [
                'id' => '1',
                'title' => 'Total Enquetes Envoyees',
                'value' => '1,240',
                'change' => 5.2,
                'changeText' => '+5,2% mois dernier',
                'icon' => 'send',
                'type' => 'info',
            ],
            [
                'id' => '2',
                'title' => 'Taux de Reponse Moyen',
                'value' => '68%',
                'change' => 2.4,
                'changeText' => '+2,4% mois dernier',
                'icon' => 'response',
                'type' => 'success',
            ],
            [
                'id' => '3',
                'title' => 'Relances en Attente',
                'value' => 12,
                'change' => 0,
                'changeText' => 'Action requise',
                'icon' => 'alert',
                'type' => 'warning',
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
            'channelSubtitle' => 'Canal à fort engagement',
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
