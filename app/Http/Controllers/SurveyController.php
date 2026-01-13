<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
  /**
   * Affiche la liste des enquêtes avec statistiques
   */
  public function index(): Response
  {
    return Inertia::render('Surveys', [
      'stats' => $this->getStats(),
      'surveys' => $this->getSurveys(),
    ]);
  }

  /**
   * Récupère les statistiques des enquêtes
   */
  private function getStats(): array
  {
    return [
      'total' => 42,
      'totalChange' => 12,
      'active' => 8,
      'avgResponseRate' => 65,
      'avgResponseChange' => 5,
    ];
  }

  /**
   * Récupère la liste complète des enquêtes
   */
  private function getSurveys(): array
  {
    return [
      [
        'id' => '1',
        'title' => 'Enquête Satisfaction Apprentis Q1',
        'subtitle' => 'Classe 2023-A',
        'idNumber' => '#SQ-2023-001',
        'audience' => 'apprentis',
        'status' => 'active',
        'createdDate' => '01/09/2023',
        'endDate' => '30/08/2023',
        'participation' => [
          'percentage' => 68,
          'current' => 124,
          'total' => 182,
        ],
      ],
      [
        'id' => '2',
        'title' => 'Insertion Professionnelle 2023',
        'subtitle' => 'Secteur Tertiaire',
        'idNumber' => '#SQ-2023-045',
        'audience' => 'entreprises',
        'status' => 'draft',
        'createdDate' => '10/10/2023',
        'endDate' => null,
        'participation' => [
          'percentage' => 0,
          'current' => 0,
          'total' => 0,
        ],
      ],
      [
        'id' => '3',
        'title' => 'Besoins en Formation Continue',
        'subtitle' => 'Tous départements',
        'idNumber' => '#SQ-2023-012',
        'audience' => 'formateurs',
        'status' => 'completed',
        'createdDate' => '01/06/2023',
        'endDate' => '30/06/2023',
        'participation' => [
          'percentage' => 92,
          'current' => 46,
          'total' => 50,
        ],
      ],
      [
        'id' => '4',
        'title' => 'Feedback Restauration Q3',
        'subtitle' => 'Services généraux',
        'idNumber' => '#SQ-2023-088',
        'audience' => 'tous',
        'status' => 'active',
        'createdDate' => '15/10/2023',
        'endDate' => '01/11/2023',
        'participation' => [
          'percentage' => 34,
          'current' => 120,
          'total' => 350,
        ],
      ],
      [
        'id' => '5',
        'title' => 'Évaluation Outils Numériques',
        'subtitle' => 'Formation Digitale',
        'idNumber' => '#SQ-2023-092',
        'audience' => 'apprentis',
        'status' => 'active',
        'createdDate' => '20/09/2023',
        'endDate' => '20/10/2023',
        'participation' => [
          'percentage' => 45,
          'current' => 67,
          'total' => 150,
        ],
      ],
      [
        'id' => '6',
        'title' => 'Partenariats Entreprises 2024',
        'subtitle' => 'Anticipation besoins',
        'idNumber' => '#SQ-2023-095',
        'audience' => 'entreprises',
        'status' => 'draft',
        'createdDate' => '25/10/2023',
        'endDate' => null,
        'participation' => [
          'percentage' => 0,
          'current' => 0,
          'total' => 0,
        ],
      ],
      [
        'id' => '7',
        'title' => 'Méthodologies Pédagogiques',
        'subtitle' => 'Innovation enseignement',
        'idNumber' => '#SQ-2023-067',
        'audience' => 'formateurs',
        'status' => 'completed',
        'createdDate' => '01/08/2023',
        'endDate' => '31/08/2023',
        'participation' => [
          'percentage' => 88,
          'current' => 44,
          'total' => 50,
        ],
      ],
      [
        'id' => '8',
        'title' => 'Infrastructures et Équipements',
        'subtitle' => 'État des lieux',
        'idNumber' => '#SQ-2023-078',
        'audience' => 'tous',
        'status' => 'active',
        'createdDate' => '10/10/2023',
        'endDate' => '30/11/2023',
        'participation' => [
          'percentage' => 12,
          'current' => 25,
          'total' => 200,
        ],
      ],
      [
        'id' => '9',
        'title' => 'Mobilité Internationale',
        'subtitle' => 'Programme Erasmus+',
        'idNumber' => '#SQ-2023-034',
        'audience' => 'apprentis',
        'status' => 'completed',
        'createdDate' => '15/05/2023',
        'endDate' => '30/06/2023',
        'participation' => [
          'percentage' => 76,
          'current' => 38,
          'total' => 50,
        ],
      ],
      [
        'id' => '10',
        'title' => 'Communication Interne',
        'subtitle' => 'Efficacité des canaux',
        'idNumber' => '#SQ-2023-099',
        'audience' => 'tous',
        'status' => 'active',
        'createdDate' => '28/10/2023',
        'endDate' => '15/11/2023',
        'participation' => [
          'percentage' => 28,
          'current' => 84,
          'total' => 300,
        ],
      ],
    ];
  }
}
