<?php

namespace App\Http\Controllers;

use App\Models\Enquete;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Rap2hpoutre\FastExcel\FastExcel;

class ReportsController extends Controller
{
    /**
     * Affiche la page des rapports analytiques
     */
    public function index(Request $request): Response
    {
        $filters = $this->sanitizeFilters($request);
        [$startDate, $endDate] = $this->resolvePeriodBounds($filters['period']);
        [$previousStart, $previousEnd] = $this->resolvePreviousBounds($startDate, $endDate);

        $currentMetrics = $this->computeMetrics($filters, $startDate, $endDate);
        $previousMetrics = $this->computeMetrics($filters, $previousStart, $previousEnd);

        $kpis = $this->buildKpis($filters, $currentMetrics, $previousMetrics);

        $surveyOptions = Enquete::query()
            ->select('id', 'titre')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($survey) => [
                'value' => (string) $survey->id,
                'label' => $survey->titre,
            ])
            ->values();

        return Inertia::render('Reports', [
            'kpis' => $kpis,
            'satisfactionEvolution' => $this->buildSatisfactionEvolution($filters, $startDate, $endDate),
            'audienceDistribution' => $this->buildAudienceDistribution($filters, $startDate, $endDate),
            'filters' => $filters,
            'surveyOptions' => $surveyOptions,
            'hasData' => $currentMetrics['contacts'] > 0
                || $currentMetrics['participations'] > 0
                || $currentMetrics['responses'] > 0,
        ]);
    }

    /**
     * Exporte les rapports selon le format demandé.
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $filters = $this->sanitizeFilters($request);
        [$startDate, $endDate] = $this->resolvePeriodBounds($filters['period']);
        $scope = $request->string('scope')->toString();
        if (! in_array($scope, ['summary', 'answers'], true)) {
            $scope = 'summary';
        }

        $format = $request->string('format')->toString();
        if (! in_array($format, ['csv', 'xlsx'], true)) {
            abort(422, 'Format d export invalide.');
        }

        $rows = $scope === 'answers'
            ? $this->buildAnswerExportRows($filters, $startDate, $endDate)
            : $this->buildExportRows($filters, $startDate, $endDate);

        $timestamp = now()->format('Ymd_His');
        $suffix = $scope === 'answers' ? 'reponses' : 'synthese';

        if ($format === 'csv') {
            return (new FastExcel($rows))->download("rapports_{$suffix}_{$timestamp}.csv");
        }

        return (new FastExcel($rows))->download("rapports_{$suffix}_{$timestamp}.xlsx");
    }

    /**
     * Nettoie les filtres entrants.
     */
    private function sanitizeFilters(Request $request): array
    {
        $period = $request->string('period')->toString();
        $survey = $request->string('survey')->toString();
        $audience = $request->string('audience')->toString();
        $indicator = $request->string('indicator')->toString();

        $validPeriods = ['7days', '30days', '90days', '6months', '1year'];
        $validAudiences = ['all', 'apprentis', 'formateurs', 'employeurs'];
        $validIndicators = ['overview', 'participation', 'satisfaction', 'responses'];

        if (! in_array($period, $validPeriods, true)) {
            $period = '30days';
        }
        if (! in_array($audience, $validAudiences, true)) {
            $audience = 'all';
        }
        if (! in_array($indicator, $validIndicators, true)) {
            $indicator = 'overview';
        }

        $survey = $survey === '' ? 'all' : $survey;

        return [
            'period' => $period,
            'survey' => $survey,
            'audience' => $audience,
            'indicator' => $indicator,
        ];
    }

    /**
     * Détermine les bornes temporelles pour la période.
     */
    private function resolvePeriodBounds(string $period): array
    {
        $endDate = Carbon::today()->endOfDay();

        $startDate = match ($period) {
            '7days' => Carbon::today()->subDays(6)->startOfDay(),
            '30days' => Carbon::today()->subDays(29)->startOfDay(),
            '90days' => Carbon::today()->subDays(89)->startOfDay(),
            '6months' => Carbon::today()->subMonthsNoOverflow(5)->startOfMonth(),
            '1year' => Carbon::today()->subMonthsNoOverflow(11)->startOfMonth(),
            default => Carbon::today()->subDays(29)->startOfDay(),
        };

        return [$startDate, $endDate];
    }

    /**
     * Détermine les bornes de la période précédente équivalente.
     */
    private function resolvePreviousBounds(Carbon $startDate, Carbon $endDate): array
    {
        $duration = $endDate->diffInSeconds($startDate) + 1;
        $previousEnd = $startDate->copy()->subSecond();
        $previousStart = $previousEnd->copy()->subSeconds($duration - 1);

        return [$previousStart, $previousEnd];
    }

    /**
     * Calcule les métriques agrégées pour une période donnée.
     */
    private function computeMetrics(array $filters, Carbon $startDate, Carbon $endDate): array
    {
        // Compter les invitations (participations proposées) depuis 'participer'
        $participations = DB::table('participer as pa')
            ->join('participants as p', 'p.id', '=', 'pa.participant_id')
            ->whereBetween('pa.created_at', [$startDate, $endDate]);

        if ($filters['survey'] !== 'all') {
            $participations->where('pa.enquete_id', $filters['survey']);
        }

        $role = $this->mapAudienceToRole($filters['audience']);
        if ($role !== null) {
            $participations->where('p.role', $role);
        }

        $participationsCount = $participations->count();

        // Compter les participants DISTINCTS ayant répondu
        $respondedParticipants = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->whereBetween('r.created_at', [$startDate, $endDate]);

        if ($filters['survey'] !== 'all') {
            $respondedParticipants->where('q.enquete_id', $filters['survey']);
        }

        if ($role !== null) {
            $respondedParticipants->where('p.role', $role);
        }

        $respondedCount = $respondedParticipants->pluck('r.participant_id')->unique()->count();

        // Compter le nombre DISTINCT d'enquêtes ayant reçu au moins une réponse
        $surveysWithResponses = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->whereBetween('r.created_at', [$startDate, $endDate]);

        if ($filters['survey'] !== 'all') {
            $surveysWithResponses->where('q.enquete_id', $filters['survey']);
        }

        if ($role !== null) {
            $surveysWithResponses->where('p.role', $role);
        }

        $responsesCount = $surveysWithResponses->pluck('q.enquete_id')->unique()->count();

        // Satisfaction moyenne : uniquement pour les questions de type Likert
        // Les réponses Likert stockent l'ID du choix, pas la position
        // On doit récupérer la position du choix pour avoir 1-5
        $satisfactionValues = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('type__reponses as tr', 'tr.id', '=', 'q.type_reponse_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->join('choixes as ch', 'ch.id', '=', DB::raw('CAST(r.valeur AS SIGNED)'), 'left')
            ->where('tr.libelle', '=', 'likert')
            ->whereBetween('r.created_at', [$startDate, $endDate]);

        if ($filters['survey'] !== 'all') {
            $satisfactionValues->where('q.enquete_id', $filters['survey']);
        }

        if ($role !== null) {
            $satisfactionValues->where('p.role', $role);
        }

        // Récupérer les valeurs en utilisant ROW_NUMBER pour numéroter les choix
        $valuesArray = $satisfactionValues
            ->select('r.valeur', 'ch.question_id')
            ->get()
            ->map(function ($row) {
                // Obtenir la position du choix au sein de sa question
                $position = DB::table('choixes')
                    ->where('question_id', $row->question_id)
                    ->where('id', '<=', $row->valeur)
                    ->count();

                return $this->normalizeNumericValue((string) $position);
            })
            ->filter(fn ($value) => $value !== null)
            ->values();

        $satisfactionAvg = $valuesArray->isNotEmpty()
            ? round($valuesArray->avg(), 2)
            : 0.0;

        $activeSurveysQuery = Enquete::query()
            ->whereDate('date_debut', '<=', now()->toDateString())
            ->whereDate('date_fin', '>=', now()->toDateString());

        if ($filters['survey'] !== 'all') {
            $activeSurveysQuery->where('id', $filters['survey']);
        }
        $activeSurveysCount = $activeSurveysQuery->count();

        return [
            'contacts' => $participationsCount,
            'participations' => $respondedCount,
            'responses' => $responsesCount,
            'satisfaction' => $satisfactionAvg,
            'active_surveys' => $activeSurveysCount,
        ];
    }

    /**
     * Construit les cartes KPI.
     */
    private function buildKpis(array $filters, array $current, array $previous): array
    {
        $participationRateCurrent = $current['contacts'] > 0
            ? round(($current['participations'] / $current['contacts']) * 100, 1)
            : 0.0;

        $participationRatePrevious = $previous['contacts'] > 0
            ? round(($previous['participations'] / $previous['contacts']) * 100, 1)
            : 0.0;

        $kpis = [
            [
                'id' => 'participation',
                'title' => 'Taux de participation',
                'value' => $participationRateCurrent.'%',
                'subtitle' => $current['contacts'] > 0 ? $current['participations'].' participants / '.$current['contacts'].' invitations' : 'Aucune invitation sur la période',
                'change' => round($participationRateCurrent - $participationRatePrevious, 1),
                'changeText' => $this->formatDeltaText($participationRateCurrent - $participationRatePrevious, 'pts'),
                'icon' => 'participation',
            ],
            [
                'id' => 'satisfaction',
                'title' => 'Satisfaction moyenne',
                'value' => number_format($current['satisfaction'], 2, '.', ''),
                'subtitle' => '/5',
                'change' => round($current['satisfaction'] - $previous['satisfaction'], 2),
                'changeText' => $this->formatDeltaText($current['satisfaction'] - $previous['satisfaction'], 'pts'),
                'icon' => 'satisfaction',
            ],
            [
                'id' => 'active',
                'title' => 'Enquêtes actives',
                'value' => $current['active_surveys'],
                'subtitle' => $filters['survey'] === 'all' ? 'Toutes les campagnes en cours' : 'Campagne sélectionnée',
                'change' => round($current['active_surveys'] - $previous['active_surveys'], 1),
                'changeText' => $this->formatDeltaText($current['active_surveys'] - $previous['active_surveys'], 'enquêtes'),
                'icon' => 'active',
            ],
            [
                'id' => 'responses',
                'title' => 'Enquêtes avec réponses',
                'value' => $current['responses'],
                'subtitle' => 'Enquêtes ayant reçu au moins une réponse',
                'change' => round($current['responses'] - $previous['responses'], 1),
                'changeText' => $this->formatDeltaText($current['responses'] - $previous['responses'], 'enquêtes'),
                'icon' => 'responses',
            ],
        ];

        if ($filters['indicator'] === 'overview') {
            return $kpis;
        }

        return array_values(array_filter($kpis, fn ($kpi) => $kpi['id'] === $filters['indicator']));
    }

    /**
     * Construit les données de la courbe de satisfaction.
     */
    private function buildSatisfactionEvolution(array $filters, Carbon $startDate, Carbon $endDate): array
    {
        $buckets = $this->buildTimeBuckets($startDate, $endDate, 6);

        return collect($buckets)->map(function ($bucket) use ($filters) {
            $query = DB::table('repondre as r')
                ->join('questions as q', 'q.id', '=', 'r.question_id')
                ->join('type__reponses as tr', 'tr.id', '=', 'q.type_reponse_id')
                ->join('participants as p', 'p.id', '=', 'r.participant_id')
                ->where('tr.libelle', '=', 'likert')
                ->whereBetween('r.created_at', [$bucket['start'], $bucket['end']]);

            if ($filters['survey'] !== 'all') {
                $query->where('q.enquete_id', $filters['survey']);
            }

            $role = $this->mapAudienceToRole($filters['audience']);
            if ($role !== null) {
                $query->where('p.role', $role);
            }

            // Récupérer les valeurs en utilisant la position du choix
            $values = $query
                ->select('r.valeur', 'q.id as question_id')
                ->get()
                ->map(function ($row) {
                    // Obtenir la position du choix au sein de sa question
                    $position = DB::table('choixes')
                        ->where('question_id', $row->question_id)
                        ->where('id', '<=', $row->valeur)
                        ->count();

                    return $this->normalizeNumericValue((string) $position);
                })
                ->filter(fn ($value) => $value !== null)
                ->values();

            return [
                'label' => $bucket['label'],
                'value' => $values->isNotEmpty() ? round($values->avg(), 2) : 0,
            ];
        })->toArray();
    }

    /**
     * Construit la répartition par public.
     */
    private function buildAudienceDistribution(array $filters, Carbon $startDate, Carbon $endDate): array
    {
        // Compter les participants DISTINCTS ayant répondu par rôle
        // NOTE: Ne pas appliquer le filtre d'audience car on veut le détail par rôle
        $baseQuery = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->whereBetween('r.created_at', [$startDate, $endDate]);

        if ($filters['survey'] !== 'all') {
            $baseQuery->where('q.enquete_id', $filters['survey']);
        }

        $results = (clone $baseQuery)
            ->select('p.role', DB::raw('COUNT(DISTINCT r.participant_id) as total'))
            ->groupBy('p.role')
            ->get();

        // Indexer les résultats par rôle
        $counts = [];
        foreach ($results as $row) {
            $counts[$row->role] = $row->total;
        }

        $segments = [
            [
                'label' => 'Apprentis',
                'role' => 'Apprentis',
                'color' => '#F18628',
            ],
            [
                'label' => 'Formateurs',
                'role' => 'Formateurs',
                'color' => '#FFB366',
            ],
            [
                'label' => 'Employeurs',
                'role' => 'Employeurs',
                'color' => '#FFD4B3',
            ],
        ];

        $withValues = collect($segments)->map(function ($segment) use ($counts) {
            $value = (int) ($counts[$segment['role']] ?? 0);

            return [
                'label' => $segment['label'],
                'value' => $value,
                'color' => $segment['color'],
            ];
        });

        $total = $withValues->sum('value');

        return $withValues->map(function ($segment) use ($total) {
            return [
                'label' => $segment['label'],
                'value' => $segment['value'],
                'percentage' => $total > 0 ? round(($segment['value'] / $total) * 100, 1) : 0,
                'color' => $segment['color'],
            ];
        })->toArray();
    }

    /**
     * Construit les lignes exportables.
     */
    private function buildExportRows(array $filters, Carbon $startDate, Carbon $endDate): Collection
    {
        $surveys = Enquete::query()
            ->when($filters['survey'] !== 'all', fn ($q) => $q->where('id', $filters['survey']))
            ->orderByDesc('created_at')
            ->get(['id', 'titre']);

        if ($surveys->isEmpty()) {
            return collect([
                [
                    'Enquête' => 'Aucune enquête',
                    'Période' => $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y'),
                    'Contacts' => 0,
                    'Participations' => 0,
                    'Taux participation (%)' => 0,
                    'Réponses' => 0,
                    'Satisfaction moyenne' => 0,
                ],
            ]);
        }

        return $surveys->map(function ($survey) use ($filters, $startDate, $endDate) {
            $scopedFilters = $filters;
            $scopedFilters['survey'] = (string) $survey->id;

            $metrics = $this->computeMetrics($scopedFilters, $startDate, $endDate);
            $rate = $metrics['contacts'] > 0
                ? round(($metrics['participations'] / $metrics['contacts']) * 100, 1)
                : 0;

            return [
                'Enquête' => $survey->titre,
                'Période' => $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y'),
                'Contacts' => $metrics['contacts'],
                'Participations' => $metrics['participations'],
                'Taux participation (%)' => $rate,
                'Réponses' => $metrics['responses'],
                'Satisfaction moyenne' => number_format($metrics['satisfaction'], 2, '.', ''),
            ];
        });
    }

    /**
     * Construit les lignes exportables détaillées (une réponse par ligne).
     */
    private function buildAnswerExportRows(array $filters, Carbon $startDate, Carbon $endDate): Collection
    {
        $query = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('enquetes as e', 'e.id', '=', 'q.enquete_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id')
            ->leftJoin('type__reponses as tr', 'tr.id', '=', 'q.type_reponse_id');

        $this->applyCommonFilters($query, $filters, $startDate, $endDate, 'q.enquete_id', 'p.role', 'r.created_at');

        $rows = $query
            ->select([
                'e.titre as enquete_titre',
                'p.nom as participant_nom',
                'p.prenom as participant_prenom',
                'p.mail as participant_mail',
                'p.role as participant_role',
                'q.numero as question_numero',
                'q.libelle as question_libelle',
                'q.id as question_id',
                'tr.libelle as question_type',
                'r.valeur as reponse_valeur',
                'r.created_at as reponse_date',
            ])
            ->orderBy('e.titre')
            ->orderBy('p.nom')
            ->orderBy('p.prenom')
            ->orderBy('q.numero')
            ->get()
            ->map(function ($row) {
                // Formater la réponse
                $reponseValue = $this->formatReponseValue($row->reponse_valeur, $row->question_id);

                return [
                    'Enquête' => $row->enquete_titre,
                    'Nom participant' => trim(($row->participant_prenom ?? '').' '.($row->participant_nom ?? '')),
                    'Email participant' => $row->participant_mail,
                    'Rôle participant' => $row->participant_role,
                    'Question #' => $row->question_numero,
                    'Question' => $row->question_libelle,
                    'Réponse' => $reponseValue,
                    'Date réponse' => $row->reponse_date ? Carbon::parse($row->reponse_date)->format('d/m/Y H:i') : null,
                ];
            });

        if ($rows->isNotEmpty()) {
            return $rows;
        }

        return collect([
            [
                'Enquête' => 'Aucune donnée',
                'Nom participant' => '-',
                'Email participant' => '-',
                'Rôle participant' => '-',
                'Question #' => '-',
                'Question' => '-',
                'Réponse' => '-',
                'Date réponse' => $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y'),
            ],
        ]);
    }

    /**
     * Formate une réponse : gère les choix simples et multiples
     */
    private function formatReponseValue(string $value, int $questionId): string
    {
        // Vérifier si c'est un JSON array (choix multiples)
        if (str_starts_with(trim($value), '[')) {
            try {
                $ids = json_decode($value, true);
                if (is_array($ids)) {
                    $labels = DB::table('choixes')
                        ->where('question_id', $questionId)
                        ->whereIn('id', $ids)
                        ->orderByRaw('FIELD(id, '.implode(',', $ids).')')
                        ->pluck('libelle')
                        ->toArray();

                    return implode(', ', $labels);
                }
            } catch (\Exception $e) {
                // Si le parsing échoue, continuer avec la valeur brute
            }
        }

        // Pour un ID unique (choix simple), récupérer le libellé
        if (is_numeric($value)) {
            $choice = DB::table('choixes')
                ->where('id', $value)
                ->where('question_id', $questionId)
                ->value('libelle');

            return $choice ?? $value;
        }

        // Pour les réponses texte/nombre, retourner la valeur brute
        return $value;
    }

    /**
     * Applique les filtres transverses.
     */
    private function applyCommonFilters($query, array $filters, Carbon $startDate, Carbon $endDate, string $surveyColumn, string $roleColumn, string $dateColumn): void
    {

        if ($filters['survey'] !== 'all') {
            $query->where($surveyColumn, $filters['survey']);
        }

        $role = $this->mapAudienceToRole($filters['audience']);
        if ($role !== null) {
            $query->where($roleColumn, $role);
        }
    }

    /**
     * Mappe un filtre public vers la valeur role stockée.
     */
    private function mapAudienceToRole(string $audience): ?string
    {
        return match ($audience) {
            'apprentis' => 'Apprentis',
            'formateurs' => 'Formateurs',
            'employeurs' => 'Employeurs',
            default => null,
        };
    }

    /**
     * Formate un delta pour les cartes KPI.
     */
    private function formatDeltaText(float $delta, string $unit): string
    {
        if (abs($delta) < 0.001) {
            return 'Stable sur la période';
        }

        $prefix = $delta > 0 ? '+' : '';

        return $prefix.round($delta, 1).' '.$unit;
    }

    /**
     * Crée des tranches de temps pour les graphiques.
     */
    private function buildTimeBuckets(Carbon $startDate, Carbon $endDate, int $bucketCount): array
    {
        $totalSeconds = max(1, $endDate->diffInSeconds($startDate));
        $step = (int) floor($totalSeconds / $bucketCount);
        $step = max(1, $step);

        $buckets = [];
        $cursor = $startDate->copy();

        for ($i = 0; $i < $bucketCount; $i++) {
            $bucketStart = $cursor->copy();
            $bucketEnd = $i === $bucketCount - 1
                ? $endDate->copy()
                : $cursor->copy()->addSeconds($step)->subSecond();

            $buckets[] = [
                'start' => $bucketStart,
                'end' => $bucketEnd,
                'label' => $bucketStart->format('d/m'),
            ];

            $cursor = $bucketEnd->copy()->addSecond();
        }

        return $buckets;
    }

    /**
     * Convertit une valeur texte en nombre exploitable.
     */
    private function normalizeNumericValue(string $value): ?float
    {
        $trimmed = trim(str_replace(',', '.', $value));

        return is_numeric($trimmed) ? (float) $trimmed : null;
    }
}
