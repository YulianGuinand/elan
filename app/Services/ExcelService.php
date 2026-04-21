<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Rap2hpoutre\FastExcel\FastExcel;

class ExcelService
{
    /**
     * Import Entreprises depuis un fichier Excel ou CSV.
     *
     * @param  string|UploadedFile  $file
     */
    public function importEntreprises($file): Collection
    {
        $extension = strtolower(
            $file instanceof UploadedFile
              ? $file->getClientOriginalExtension()
              : pathinfo($file, PATHINFO_EXTENSION)
        );

        if ($extension === 'csv') {
            return $this->importFromCsv($file);
        }

        // XLSX / XLS → FastExcel
        return $this->importFromExcel($file);
    }

    /**
     * Import CSV via fgetcsv natif (supporte , et ;).
     */
    private function importFromCsv($file): Collection
    {
        $path = $file instanceof UploadedFile
          ? $file->getRealPath()
          : $file;

        $handle = fopen($path, 'r');
        if ($handle === false) {
            throw new \RuntimeException("Impossible d'ouvrir le fichier CSV.");
        }

        // Lire la première ligne pour detecter le separateur et les en-têtes
        $firstLine = fgets($handle);
        rewind($handle);

        // Detecter le separateur (;  ou ,)
        $delimiter = substr_count($firstLine, ';') >= substr_count($firstLine, ',') ? ';' : ',';

        // Supprimer le BOM UTF-8 eventuel
        $bom = "\xEF\xBB\xBF";
        $firstLine = ltrim($firstLine, $bom);

        $rows = [];
        $headers = null;

        while (($line = fgetcsv($handle, 0, $delimiter)) !== false) {
            // Nettoyer le BOM sur la première cellule de la première ligne
            if ($headers === null) {
                $line[0] = ltrim($line[0], "\xEF\xBB\xBF");
                $headers = array_map('trim', $line);

                continue;
            }

            if (count($line) !== count($headers)) {
                continue; // ligne mal formee
            }

            $rows[] = array_combine($headers, array_map('trim', $line));
        }

        fclose($handle);

        return $this->mapRows(collect($rows));
    }

    /**
     * Import XLSX/XLS via FastExcel.
     */
    private function importFromExcel($file): Collection
    {
        // FastExcel a besoin du vrai chemin avec la bonne extension
        if ($file instanceof UploadedFile) {
            $tmpPath = sys_get_temp_dir().DIRECTORY_SEPARATOR
              .uniqid('elan_import_').'.'.$file->getClientOriginalExtension();
            $file->move(dirname($tmpPath), basename($tmpPath));
            $path = $tmpPath;
        } else {
            $path = $file;
        }

        try {
            $collection = (new FastExcel)->import($path, function ($line) {
                return $line;
            });

            return $this->mapRows($collection);
        } finally {
            if (isset($tmpPath) && file_exists($tmpPath)) {
                unlink($tmpPath);
            }
        }
    }

    /**
     * Mappe les colonnes du fichier vers les champs entreprise.
     */
    private function mapRows(Collection $rows): Collection
    {
        return $rows
            ->map(function ($line) {
                return [
                    'raison_sociale' => $line['raison_sociale'] ?? $line['Raison sociale'] ?? $line['Raison Sociale'] ?? null,
                    'siret' => $line['siret'] ?? $line['SIRET'] ?? $line['Siret'] ?? null,
                    'secteur' => $line['secteur'] ?? $line['Secteur'] ?? null,
                    'taille' => $line['taille'] ?? $line['Taille'] ?? null,
                    'mail' => $line['mail'] ?? $line['Mail'] ?? $line['email'] ?? $line['Email'] ?? null,
                    'telephone' => $line['telephone'] ?? $line['Telephone'] ?? $line['Telephone'] ?? null,
                    'interlocuteur' => $line['interlocuteur'] ?? $line['Interlocuteur'] ?? $line['Contact'] ?? null,
                    'fonction' => $line['fonction'] ?? $line['Fonction'] ?? null,
                    'ville' => $line['ville'] ?? $line['Ville'] ?? null,
                    'adresse' => $line['adresse'] ?? $line['Adresse'] ?? null,
                    'code_postal' => $line['code_postal'] ?? $line['Code postal'] ?? $line['Code Postal'] ?? null,
                ];
            })
            ->filter(fn ($item) => ! empty($item['raison_sociale']));
    }

    /**
     * Import Participants depuis un fichier Excel ou CSV.
     *
     * @param  string|UploadedFile  $file
     */
    public function importParticipants($file): Collection
    {
        $extension = strtolower(
            $file instanceof UploadedFile
              ? $file->getClientOriginalExtension()
              : pathinfo($file, PATHINFO_EXTENSION)
        );

        if ($extension === 'csv') {
            $rows = $this->importFromCsvRaw($file);
        } else {
            $rows = $this->importFromExcelRaw($file);
        }

        return $this->mapParticipants($rows);
    }

    /**
     * Mappe les colonnes du fichier vers les champs participant.
     */
    private function mapParticipants(Collection $rows): Collection
    {
        return $rows
            ->map(function ($line) {
                return [
                    'nom' => $line['nom'] ?? $line['Nom'] ?? null,
                    'prenom' => $line['prenom'] ?? $line['Prenom'] ?? $line['Prenom'] ?? null,
                    'mail' => $line['mail'] ?? $line['Mail'] ?? $line['Email'] ?? $line['email'] ?? null,
                    'telephone' => $line['telephone'] ?? $line['Telephone'] ?? $line['Telephone'] ?? null,
                    'role' => $line['role'] ?? $line['Role'] ?? $line['Role'] ?? 'Apprentis',
                    'ecole' => $line['ecole'] ?? $line['Ecole'] ?? $line['ecole'] ?? null,
                    'formation' => $line['formation'] ?? $line['Formation'] ?? null,
                    'entreprise' => $line['entreprise'] ?? $line['Entreprise'] ?? null,
                    'date_entree' => $line['date_entree'] ?? $line['Date entree'] ?? $line['Date entree'] ?? null,
                    'date_sortiee' => $line['date_sortiee'] ?? $line['Date sortie'] ?? $line['Date sortie'] ?? null,
                ];
            })
            ->filter(fn ($item) => ! empty($item['nom']) && ! empty($item['prenom']) && ! empty($item['mail']));
    }

    /**
     * Parse le fichier et retourne les lignes + les entites inconnues (school/formation/company non trouvees en base).
     * Utilise pour le previsualisateur cote frontend.
     */
    public function previewParticipants($file, array $knownEcoles, array $knownFormations, array $knownEntreprises): array
    {
        $extension = strtolower(
            $file instanceof UploadedFile
              ? $file->getClientOriginalExtension()
              : pathinfo($file, PATHINFO_EXTENSION)
        );

        $raw = $extension === 'csv'
          ? $this->importFromCsvRaw($file)
          : $this->importFromExcelRaw($file);

        $rows = $this->mapParticipants($raw);

        $unknownEcoles = [];
        $unknownFormations = [];
        $unknownEntreprises = [];

        foreach ($rows as $row) {
            if ($row['ecole'] && ! in_array(strtolower($row['ecole']), array_map('strtolower', $knownEcoles))) {
                $unknownEcoles[] = $row['ecole'];
            }
            if ($row['formation'] && ! in_array(strtolower($row['formation']), array_map('strtolower', $knownFormations))) {
                $unknownFormations[] = $row['formation'];
            }
            if ($row['entreprise'] && ! in_array(strtolower($row['entreprise']), array_map('strtolower', $knownEntreprises))) {
                $unknownEntreprises[] = $row['entreprise'];
            }
        }

        return [
            'rows' => $rows->values()->all(),
            'unknownEcoles' => array_values(array_unique($unknownEcoles)),
            'unknownFormations' => array_values(array_unique($unknownFormations)),
            'unknownEntreprises' => array_values(array_unique($unknownEntreprises)),
        ];
    }

    /**
     * Import CSV brut (sans mapping) pour le preview.
     */
    private function importFromCsvRaw($file): Collection
    {
        $path = $file instanceof UploadedFile ? $file->getRealPath() : $file;
        $handle = fopen($path, 'r');
        if (! $handle) {
            throw new \RuntimeException("Impossible d'ouvrir le CSV.");
        }

        $firstLine = fgets($handle);
        rewind($handle);
        $delimiter = substr_count($firstLine, ';') >= substr_count($firstLine, ',') ? ';' : ',';

        $rows = [];
        $headers = null;
        while (($line = fgetcsv($handle, 0, $delimiter)) !== false) {
            if ($headers === null) {
                $line[0] = ltrim($line[0], "\xEF\xBB\xBF");
                $headers = array_map('trim', $line);

                continue;
            }
            if (count($line) !== count($headers)) {
                continue;
            }
            $rows[] = array_combine($headers, array_map('trim', $line));
        }
        fclose($handle);

        return collect($rows);
    }

    /**
     * Import Excel brut (sans mapping) pour le preview.
     */
    private function importFromExcelRaw($file): Collection
    {
        if ($file instanceof UploadedFile) {
            $tmpPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.uniqid('elan_import_').'.'.$file->getClientOriginalExtension();
            $file->move(dirname($tmpPath), basename($tmpPath));
            $path = $tmpPath;
        } else {
            $path = $file;
        }
        try {
            return (new FastExcel)->import($path, fn ($line) => $line);
        } finally {
            if (isset($tmpPath) && file_exists($tmpPath)) {
                unlink($tmpPath);
            }
        }
    }
}
