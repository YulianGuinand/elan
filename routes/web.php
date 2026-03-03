<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\EcoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\IsAdmin;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Routes protegees par authentification
Route::middleware(['auth', 'verified'])->group(function () {

    // ============================================
    // TABLEAU DE BORD
    // ============================================
    Route::get('/tableau-de-bord', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ============================================
    // ENQUETES
    // ============================================
    Route::prefix('enquetes')->group(function () {

        // Liste de toutes les enquêtes (admin)
        // Liste de toutes les enquêtes
        Route::get('/', [SurveyController::class, 'index'])
            ->name('surveys.index');

        // Créer une enquête (admin & superadmin)
        Route::get('/creer', [SurveyController::class, 'create'])
            ->name('surveys.create')->middleware(["is_admin","is_superadmin"]);

        Route::post('/constructeur', [SurveyController::class, 'storeFromBuilder'])
            ->name('surveys.builder.store')->middleware(["is_admin","is_superadmin"]);

        // Remplir une enquête
        Route::get('/{id}/remplir', [SurveyController::class, 'fill'])
            ->name('surveys.fill');+
        Route::post('/{id}/remplir', [SurveyController::class, 'submitFill'])
            ->name('surveys.fill.submit');

        // Modifier une enquête (protégé par is_admin, puis check admin/superadmin dans le controller)
        Route::get('/{id}/modifier', [SurveyController::class, 'edit'])
            ->name('surveys.edit')->middleware(["is_admin"]);
        Route::put('/{id}/modifier', [SurveyController::class, 'update'])
            ->name('surveys.update')->middleware(["is_admin"]);

        // Supprimer toutes les enquêtes (superadmin uniquement)
        Route::delete('/tout', [SurveyController::class, 'destroyAll'])
            ->name('surveys.destroy-all')->middleware(["is_superadmin"]);

        // Supprimer une enquête (protégé par is_admin, admin supprime les siennes, superadmin toutes)
        Route::delete('/{id}', [SurveyController::class, 'destroy'])
            ->name('surveys.destroy')->middleware(["is_admin"]);
    });

    // ============================================
    // PARTICIPANTS
    // ============================================
    Route::prefix('participants')->group(function () {
        Route::get('/', [ParticipantController::class, 'index'])->name('participants.index');
        Route::post('/bulk-destroy', [ParticipantController::class, 'bulkDestroy'])->name('participants.bulk-destroy')->middleware(['is_admin', 'is_superadmin']);

        Route::post('/import', [ParticipantController::class, 'importCsv'])->name('participants.import')->middleware(['is_admin', 'is_superadmin']);
        Route::get('/exemple', [ParticipantController::class, 'downloadExemple'])->name('participants.exemple')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/ajouter', [ParticipantController::class, 'create'])->name('participants.create')->middleware(['is_admin', 'is_superadmin']);
        Route::post('/', [ParticipantController::class, 'store'])->name('participants.store')->middleware(['is_admin', 'is_superadmin']);
        Route::get('/{participant}', [ParticipantController::class, 'show'])->name('participants.show');
        Route::get('/{participant}/modifier', [ParticipantController::class, 'edit'])->name('participants.edit')->middleware(['is_admin', 'is_superadmin']);
        Route::put('/{participant}', [ParticipantController::class, 'update'])->name('participants.update')->middleware(['is_admin', 'is_superadmin']);
        Route::delete('/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy')->middleware(['is_admin', 'is_superadmin']);
    });

    // ============================================
    // ENTREPRISES
    // ============================================
    Route::prefix('entreprises')->group(function () {
        Route::get('/', [EntrepriseController::class, 'index'])
            ->name('entreprises.index');

        Route::post('/', [EntrepriseController::class, 'store'])
            ->name('entreprises.store')->middleware(['is_admin','is_superadmin']);

        Route::post('/import', [EntrepriseController::class, 'importCsv'])
            ->name('entreprises.import')->middleware(['is_admin','is_superadmin']);

        Route::get('/exemple', [EntrepriseController::class, 'downloadExemple'])
            ->name('entreprises.exemple')->middleware(['is_admin','is_superadmin']);
    });

    // ============================================
    // ECOLES
    // ============================================
    Route::prefix('ecoles')->group(function () {
        Route::get('/', [EcoleController::class, 'index'])
            ->name('ecoles.index');

        Route::post('/bulk-destroy', [EcoleController::class, 'bulkDestroy'])
            ->name('ecoles.bulk-destroy')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/ajouter', [EcoleController::class, 'create'])
            ->name('ecoles.create')->middleware(['is_admin', 'is_superadmin']);

        Route::post('/', [EcoleController::class, 'store'])
            ->name('ecoles.store')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/{ecole}', [EcoleController::class, 'show'])
            ->name('ecoles.show');

        Route::get('/{ecole}/modifier', [EcoleController::class, 'edit'])
            ->name('ecoles.edit')->middleware(['is_admin', 'is_superadmin']);

        Route::put('/{ecole}', [EcoleController::class, 'update'])
            ->name('ecoles.update')->middleware(['is_admin', 'is_superadmin']);

        Route::delete('/{ecole}', [EcoleController::class, 'destroy'])
            ->name('ecoles.destroy')->middleware(['is_admin', 'is_superadmin']);
    });

    // ============================================
    // CONTRATS
    // ============================================
    Route::prefix('contrats')->group(function () {
        Route::get('/', [\App\Http\Controllers\ContratController::class, 'index'])
            ->name('contrats.index');

        Route::get('/ajouter', [\App\Http\Controllers\ContratController::class, 'create'])
            ->name('contrats.create')->middleware(['is_admin', 'is_superadmin']);

        Route::post('/', [\App\Http\Controllers\ContratController::class, 'store'])
            ->name('contrats.store')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/{contrat}', [\App\Http\Controllers\ContratController::class, 'show'])
            ->name('contrats.show');

        Route::get('/{contrat}/modifier', [\App\Http\Controllers\ContratController::class, 'edit'])
            ->name('contrats.edit')->middleware(['is_admin', 'is_superadmin']);

        Route::put('/{contrat}', [\App\Http\Controllers\ContratController::class, 'update'])
            ->name('contrats.update')->middleware(['is_admin', 'is_superadmin']);

        Route::delete('/{contrat}', [\App\Http\Controllers\ContratController::class, 'destroy'])
            ->name('contrats.destroy')->middleware(['is_admin', 'is_superadmin']);
    });

    // ============================================
    // FORMATIONS
    // ============================================
    Route::prefix('formations')->group(function () {
        Route::get('/', [\App\Http\Controllers\FormationController::class, 'index'])
            ->name('formations.index');

        Route::post('/bulk-destroy', [\App\Http\Controllers\FormationController::class, 'bulkDestroy'])
            ->name('formations.bulk-destroy')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/ajouter', [\App\Http\Controllers\FormationController::class, 'create'])
            ->name('formations.create')->middleware(['is_admin', 'is_superadmin']);

        Route::post('/', [\App\Http\Controllers\FormationController::class, 'store'])
            ->name('formations.store')->middleware(['is_admin', 'is_superadmin']);

        Route::get('/{formation}', [\App\Http\Controllers\FormationController::class, 'show'])
            ->name('formations.show');

        Route::get('/{formation}/modifier', [\App\Http\Controllers\FormationController::class, 'edit'])
            ->name('formations.edit')->middleware(['is_admin', 'is_superadmin']);

        Route::put('/{formation}', [\App\Http\Controllers\FormationController::class, 'update'])
            ->name('formations.update')->middleware(['is_admin', 'is_superadmin']);

        Route::delete('/{formation}', [\App\Http\Controllers\FormationController::class, 'destroy'])
            ->name('formations.destroy')->middleware(['is_admin', 'is_superadmin']);
    });

    // ============================================
    // RAPPORTS
    // ============================================
    Route::get('/rapports', [ReportsController::class, 'index'])
        ->name('reports.index');

    // ============================================
    // PARAMETRES
    // ============================================
    Route::get('/parametres', [SettingsController::class, 'index'])->middleware(["is_superadmin"])
        ->name('settings.index');

    // ============================================
    // PROFIL
    // ============================================
    // Route::prefix('profil')->group(function () {
    //     Route::get('/', [ProfileController::class, 'edit'])
    //         ->name('profile.edit');

    //     Route::patch('/', [ProfileController::class, 'update'])
    //         ->name('profile.update');

    //     Route::delete('/', [ProfileController::class, 'destroy'])
    //         ->name('profile.destroy');
    // });
});

require __DIR__ . '/auth.php';
