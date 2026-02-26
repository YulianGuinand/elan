<?php

namespace App\Services;

use Rap2hpoutre\FastExcel\FastExcel;

class ExcelService
{
  /**
   * Import Entreprises from an Excel file.
   *
   * @param string|\Illuminate\Http\UploadedFile $file
   * @return \Illuminate\Support\Collection
   */
  public function importEntreprises($file)
  {
    $collection = (new FastExcel)->import($file, function ($line) {
      return [
        'titre' => $line['titre'] ?? $line['Titre'] ?? null,
        'description' => $line['description'] ?? $line['Description'] ?? null,
        'date_debut' => $line['date_debut'] ?? $line['Date début'] ?? $line['Date Debut'] ?? null,
        'date_fin' => $line['date_fin'] ?? $line['Date fin'] ?? $line['Date Fin'] ?? null,
        'type_contact' => $line['type_contact'] ?? $line['Type contact'] ?? $line['Type Contact'] ?? null,
      ];
    });

    return $collection->filter(function ($item) {
      return !empty($item['titre']);
    });
  }
}
