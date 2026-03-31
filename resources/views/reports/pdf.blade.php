<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Rapport analytique</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1f2937;
            margin: 24px;
        }

        h1 {
            margin: 0 0 8px 0;
            font-size: 20px;
        }

        .meta {
            margin-bottom: 16px;
            color: #4b5563;
        }

        .filters {
            margin-bottom: 16px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            background: #f9fafb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f3f4f6;
            font-weight: bold;
        }

        .empty {
            margin-top: 16px;
            padding: 12px;
            background: #fffbeb;
            border: 1px solid #fef3c7;
            color: #92400e;
        }
    </style>
</head>

<body>
    <h1>
        Rapport analytique
        @if (($scope ?? 'summary') === 'answers')
            - Réponses détaillées
        @else
            - Synthèse
        @endif
    </h1>
    <div class="meta">Généré le {{ $generatedAt }}</div>

    <div class="filters">
        <strong>Période:</strong> {{ $startDate }} - {{ $endDate }}<br>
        <strong>Enquête:</strong> {{ $filters['survey'] }}<br>
        <strong>Public cible:</strong> {{ $filters['audience'] }}<br>
        <strong>Indicateur:</strong> {{ $filters['indicator'] }}<br>
        <strong>Type export:</strong>
        @if (($scope ?? 'summary') === 'answers')
            Réponses détaillées
        @else
            Synthèse
        @endif
    </div>

    @if ($rows->isEmpty())
        <div class="empty">Aucune donnée disponible pour ces filtres.</div>
    @else
        <table>
            <thead>
                <tr>
                    @foreach (array_keys($rows->first()) as $header)
                        <th>{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($rows as $row)
                    <tr>
                        @foreach ($row as $value)
                            <td>{{ $value }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>

</html>
