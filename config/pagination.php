<?php

/**
 * Configuration des paramètres de pagination globaux
 */

return [
    /**
     * Nombre d'éléments par défaut pour la pagination
     */
    'per_page' => (int) env('PAGINATION_PER_PAGE', 10),

    /**
     * Options disponibles pour choisir le nombre d'éléments par page
     */
    'per_page_options' => [5, 10, 15, 25, 50],
];
