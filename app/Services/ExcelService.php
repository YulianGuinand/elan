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
   * @param string|UploadedFile $file
   * @return Collection
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

    $rows      = [];
    $headers   = null;

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
      $tmpPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR
        . uniqid('elan_import_') . '.' . $file->getClientOriginalExtension();
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
          'raison_sociale' => $line['raison_sociale'] ?? $line['Raison sociale']  ?? $line['Raison Sociale'] ?? null,
          'siret'          => $line['siret']          ?? $line['SIRET']            ?? $line['Siret']         ?? null,
          'secteur'        => $line['secteur']        ?? $line['Secteur']          ?? null,
          'taille'         => $line['taille']         ?? $line['Taille']           ?? null,
          'mail'           => $line['mail']           ?? $line['Mail']             ?? $line['email']         ?? $line['Email'] ?? null,
          'telephone'      => $line['telephone']      ?? $line['Telephone']        ?? $line['Telephone']     ?? null,
          'interlocuteur'  => $line['interlocuteur']  ?? $line['Interlocuteur']    ?? $line['Contact']       ?? null,
          'fonction'       => $line['fonction']       ?? $line['Fonction']         ?? null,
          'ville'          => $line['ville']          ?? $line['Ville']            ?? null,
          'adresse'        => $line['adresse']        ?? $line['Adresse']          ?? null,
          'code_postal'    => $line['code_postal']    ?? $line['Code postal']      ?? $line['Code Postal']   ?? null,
        ];
      })
      ->filter(fn($item) => !empty($item['raison_sociale']));
  }
}
