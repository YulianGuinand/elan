<?php

namespace App\Http\Controllers;

use App\Models\Enquete;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Rap2hpoutre\FastExcel\FastExcel;
use Inertia\Inertia;
use Inertia\Response;

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

        $format = $request->string('format')->toString();
        if (!in_array($format, ['csv', 'xlsx', 'pdf'], true)) {
            abort(422, 'Format d export invalide.');
        }

        $rows = $this->buildExportRows($filters, $startDate, $endDate);
        $timestamp = now()->format('Ymd_His');

        if ($format === 'csv') {
            return (new FastExcel($rows))->download("rapports_{$timestamp}.csv");
        }

        if ($format === 'xlsx') {
            return (new FastExcel($rows))->download("rapports_{$timestamp}.xlsx");
        }

        $pdf = app('dompdf.wrapper');
        $pdf->loadView('reports.pdf', [
            'generatedAt' => now()->format('d/m/Y H:i'),
            'filters' => $filters,
            'startDate' => $startDate->format('d/m/Y'),
            'endDate' => $endDate->format('d/m/Y'),
            'rows' => $rows,
        ]);

        return $pdf->download("rapports_{$timestamp}.pdf");
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

        if (!in_array($period, $validPeriods, true)) {
            $period = '30days';
        }
        if (!in_array($audience, $validAudiences, true)) {
            $audience = 'all';
        }
        if (!in_array($indicator, $validIndicators, true)) {
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
        $contacts = DB::table('contacter as c')
            ->join('participants as p', 'p.id', '=', 'c.participant_id');

        $this->applyCommonFilters($contacts, $filters, $startDate, $endDate, 'c.enquete_id', 'p.role', 'c.date_contact');
        $contactsCount = $contacts->count();

        $participations = DB::table('participer as pa')
            ->join('participants as p', 'p.id', '=', 'pa.participant_id');

        $this->applyCommonFilters($participations, $filters, $startDate, $endDate, 'pa.enquete_id', 'p.role', 'pa.created_at');
        $participationsCount = $participations->count();

        $responses = DB::table('repondre as r')
            ->join('questions as q', 'q.id', '=', 'r.question_id')
            ->join('participants as p', 'p.id', '=', 'r.participant_id');

        $this->applyCommonFilters($responses, $filters, $startDate, $endDate, 'q.enquete_id', 'p.role', 'r.created_at');
        $responsesCount = $responses->count();

        $satisfactionValues = (clone $responses)
            ->pluck('r.valeur')
            ->map(fn ($value) => $this->normalizeNumericValue((string) $value))
            ->filter(fn ($value) => $value !== null)
            ->values();

        $satisfactionAvg = $satisfactionValues->isNotEmpty()
            ? round($satisfactionValues->avg(), 2)
            : 0.0;

        $activeSurveysQuery = Enquete::query()
            ->whereDate('date_debut', '<=', now()->toDateString())
            ->whereDate('date_fin', '>=', now()->toDateString());

        if ($filters['survey'] !== 'all') {
            $activeSurveysQuery->where('id', $filters['survey']);
        }
        $activeSurveysCount = $activeSurveysQuery->count();

        return [
            'contacts' => $contactsCount,
            'participations' => $participationsCount,
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
                'value' => $participationRateCurrent . '%',
                'subtitle' => $current['contacts'] > 0 ? $current['participations'] . ' réponses / ' . $current['contacts'] . ' contacts' : 'Aucun contact sur la période',
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
                'title' => 'Réponses totales',
                'value' => $current['responses'],
                'subtitle' => null,
                'change' => round($current['responses'] - $previous['responses'], 1),
                'changeText' => $this->formatDeltaText($current['responses'] - $previous['responses'], 'réponses'),
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
                ->join('participants as p', 'p.id', '=', 'r.participant_id');

            $this->applyCommonFilters(
                $query,
                $filters,
                $bucket['start'],
                $bucket['end'],
                'q.enquete_id',
                'p.role',
                'r.created_at'
            );

            $values = $query
                ->pluck('r.valeur')
                ->map(fn ($value) => $this->normalizeNumericValue((string) $value))
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
        $baseQuery = DB::table('participer as pa')
            ->join('participants as p', 'p.id', '=', 'pa.participant_id');

        $this->applyCommonFilters($baseQuery, $filters, $startDate, $endDate, 'pa.enquete_id', 'p.role', 'pa.created_at');

        $counts = $baseQuery
            ->select('p.role', DB::raw('COUNT(*) as total'))
            ->groupBy('p.role')
            ->pluck('total', 'p.role');

        $segments = [
            [
                'label' => 'Apprentis',
                'role' => 'Apprenti',
                'color' => '#F18628',
            ],
            [
                'label' => 'Formateurs',
                'role' => 'Formateur',
                'color' => '#FFB366',
            ],
            [
                'label' => 'Employeurs',
                'role' => 'Employeur',
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
                    'Période' => $startDate->format('d/m/Y') . ' - ' . $endDate->format('d/m/Y'),
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
                'Période' => $startDate->format('d/m/Y') . ' - ' . $endDate->format('d/m/Y'),
                'Contacts' => $metrics['contacts'],
                'Participations' => $metrics['participations'],
                'Taux participation (%)' => $rate,
                'Réponses' => $metrics['responses'],
                'Satisfaction moyenne' => number_format($metrics['satisfaction'], 2, '.', ''),
            ];
        });
    }

    /**
     * Applique les filtres transverses.
     */
    private function applyCommonFilters($query, array $filters, Carbon $startDate, Carbon $endDate, string $surveyColumn, string $roleColumn, string $dateColumn): void
    {
        $query->whereBetween($dateColumn, [$startDate, $endDate]);

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
            'apprentis' => 'Apprenti',
            'formateurs' => 'Formateur',
            'employeurs' => 'Employeur',
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
        return $prefix . round($delta, 1) . ' ' . $unit;
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
