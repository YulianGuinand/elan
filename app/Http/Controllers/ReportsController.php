<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    /**
     * Affiche la page des rapports analytiques
     */
    public function index(): Response
    {
        return Inertia::render('Reports', [
            'kpis' => $this->getReportKPIs(),
            'satisfactionEvolution' => $this->getSatisfactionEvolution(),
            'audienceDistribution' => $this->getAudienceDistribution(),
        ]);
    }

    /**
     * Recupere les KPIs pour les rapports
     */
    private function getReportKPIs(): array
    {
        return [
            [
                'id' => '1',
                'title' => 'Taux de participation',
                'value' => '78%',
                'subtitle' => null,
                'change' => 5,
                'changeText' => '+5% vs mois dernier',
                'icon' => 'participation',
            ],
            [
                'id' => '2',
                'title' => 'Satisfaction Moyenne',
                'value' => '4.2',
                'subtitle' => '/5',
                'change' => 0.2,
                'changeText' => '+0.2 pts',
                'icon' => 'satisfaction',
            ],
            [
                'id' => '3',
                'title' => 'Enquêtes Actives',
                'value' => 12,
                'subtitle' => 'Dont 3 se terminent bientôt',
                'change' => 0,
                'changeText' => 'Stable',
                'icon' => 'active',
            ],
            [
                'id' => '4',
                'title' => 'Reponses Totales',
                'value' => '1,245',
                'subtitle' => null,
                'change' => 12,
                'changeText' => '+12% cette annee',
                'icon' => 'responses',
            ],
        ];
    }

    /**
     * Recupere les donnees evolution de la satisfaction (6 mois)
     */
    private function getSatisfactionEvolution(): array
    {
        return [
            ['label' => 'Jan', 'value' => 2.1],
            ['label' => 'Fev', 'value' => 2.3],
            ['label' => 'Mar', 'value' => 2.2],
            ['label' => 'Avr', 'value' => 3.4],
            ['label' => 'Mai', 'value' => 3.8],
            ['label' => 'Juin', 'value' => 4.2],
        ];
    }

    /**
     * Recupere la repartition par public
     */
    private function getAudienceDistribution(): array
    {
        return [
            [
                'label' => 'Apprentis',
                'value' => 685,
                'percentage' => 55,
                'color' => '#F18628',
            ],
            [
                'label' => 'Formateurs',
                'value' => 311,
                'percentage' => 25,
                'color' => '#FFB366',
            ],
            [
                'label' => 'Employeurs',
                'value' => 249,
                'percentage' => 20,
                'color' => '#FFD4B3',
            ],
        ];
    }
}
