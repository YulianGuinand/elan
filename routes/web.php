<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EcoleController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\InlineCreateController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// SEO Routes (public)
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');

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
    // CREATION INLINE (modals)
    // ============================================
    Route::prefix('inline')->name('inline.')->group(function () {
        Route::post('/ecole', [InlineCreateController::class, 'storeEcole'])->name('ecole');
        Route::post('/formation', [InlineCreateController::class, 'storeFormation'])->name('formation');
        Route::post('/entreprise', [InlineCreateController::class, 'storeEntreprise'])->name('entreprise');
    });

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
            ->name('surveys.create')->middleware('is_admin_or_superadmin');

        Route::post('/constructeur', [SurveyController::class, 'storeFromBuilder'])
            ->name('surveys.builder.store')->middleware('is_admin_or_superadmin');

        // Remplir une enquête
        Route::get('/{id}/remplir', [SurveyController::class, 'fill'])
            ->name('surveys.fill');
        Route::post('/{id}/remplir', [SurveyController::class, 'submitFill'])
            ->name('surveys.fill.submit');

        // Voir les réponses
        Route::get('/{id}/reponses', [SurveyController::class, 'responses'])
            ->name('surveys.responses')->middleware(['is_admin']);

        // Voir les informations
        Route::get('/{id}/information', [SurveyController::class, 'informations'])
            ->name('surveys.informations')->middleware(["is_admin"]);

        // Dupliquer une enquête (protégé par is_admin)
        Route::post('/{id}/dupliquer', [SurveyController::class, 'duplicate'])
            ->name('surveys.duplicate')->middleware(['is_admin']);

        // Modifier une enquête (protégé par is_admin, puis check admin/superadmin dans le controller)
        Route::get('/{id}/modifier', [SurveyController::class, 'edit'])
            ->name('surveys.edit')->middleware(['is_admin']);
        Route::put('/{id}/modifier', [SurveyController::class, 'update'])
            ->name('surveys.update')->middleware(['is_admin']);

        // Supprimer plusieurs enquêtes (protégé par is_admin)
        Route::post('/bulk-destroy', [SurveyController::class, 'bulkDestroy'])
            ->name('surveys.bulk-destroy')->middleware(['is_admin']);

        // Supprimer toutes les enquêtes (superadmin uniquement)
        Route::delete('/tout', [SurveyController::class, 'destroyAll'])
            ->name('surveys.destroy-all')->middleware(['is_superadmin']);

        // Supprimer une enquête (protégé par is_admin, admin supprime les siennes, superadmin toutes)
        Route::delete('/{id}', [SurveyController::class, 'destroy'])
            ->name('surveys.destroy')->middleware(['is_admin']);
    });

    // ============================================
    // PARTICIPANTS
    // ============================================
    Route::prefix('participants')->group(function () {
        Route::get('/', [ParticipantController::class, 'index'])->name('participants.index');
        Route::post('/bulk-destroy', [ParticipantController::class, 'bulkDestroy'])->name('participants.bulk-destroy')->middleware('is_admin_or_superadmin');

        Route::post('/import', [ParticipantController::class, 'importCsv'])->name('participants.import')->middleware('is_admin_or_superadmin');
        Route::get('/exemple', [ParticipantController::class, 'downloadExemple'])->name('participants.exemple')->middleware('is_admin_or_superadmin');

        Route::get('/ajouter', [ParticipantController::class, 'create'])->name('participants.create')->middleware(['is_admin']);
        Route::post('/preview', [ParticipantController::class, 'previewCsv'])->name('participants.preview')->middleware(['is_admin']);
        Route::post('/', [ParticipantController::class, 'store'])->name('participants.store')->middleware(['is_admin']);
        Route::get('/{participant}', [ParticipantController::class, 'show'])->name('participants.show');
        Route::get('/{participant}/modifier', [ParticipantController::class, 'edit'])->name('participants.edit')->middleware('is_admin_or_superadmin');
        Route::put('/{participant}', [ParticipantController::class, 'update'])->name('participants.update')->middleware('is_admin_or_superadmin');
        Route::delete('/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy')->middleware('is_admin_or_superadmin');
    });

    // ============================================
    // ENTREPRISES
    // ============================================
    Route::prefix('entreprises')->group(function () {
        Route::get('/', [EntrepriseController::class, 'index'])
            ->name('entreprises.index');

        Route::post('/bulk-destroy', [EntrepriseController::class, 'bulkDestroy'])
            ->name('entreprises.bulk-destroy');

        Route::post('/', [EntrepriseController::class, 'store'])
            ->name('entreprises.store')->middleware('is_admin_or_superadmin');

        Route::post('/import', [EntrepriseController::class, 'importCsv'])
            ->name('entreprises.import')->middleware('is_admin_or_superadmin');

        Route::get('/exemple', [EntrepriseController::class, 'downloadExemple'])
            ->name('entreprises.exemple');

        Route::get('/{entreprise}', [EntrepriseController::class, 'show'])
            ->name('entreprises.show');

        Route::get('/{entreprise}/modifier', [EntrepriseController::class, 'edit'])
            ->name('entreprises.edit');

        Route::put('/{entreprise}', [EntrepriseController::class, 'update'])
            ->name('entreprises.update');

        Route::delete('/{entreprise}', [EntrepriseController::class, 'destroy'])
            ->name('entreprises.destroy');
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
    // UTILISATEURS
    // ============================================
    Route::prefix('utilisateurs')->middleware(['is_admin_or_superadmin'])->group(function () {
        Route::get('/', [\App\Http\Controllers\UserController::class, 'index'])
            ->name('users.index');

        Route::get('/ajouter', [\App\Http\Controllers\UserController::class, 'create'])
            ->name('users.create');

        Route::post('/', [\App\Http\Controllers\UserController::class, 'store'])
            ->name('users.store');

        Route::get('/{user}/modifier', [\App\Http\Controllers\UserController::class, 'edit'])
            ->name('users.edit');

        Route::put('/{user}', [\App\Http\Controllers\UserController::class, 'update'])
            ->name('users.update');

        Route::delete('/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])
            ->name('users.destroy');
    });

    // ============================================
    // RAPPORTS
    // ============================================
    Route::get('/rapports', [ReportsController::class, 'index'])
        ->name('reports.index');
    Route::get('/rapports/export', [ReportsController::class, 'export'])
        ->name('reports.export');

    // ============================================
    // PARAMETRES
    // ============================================
    Route::get('/parametres', [SettingsController::class, 'index'])->middleware(['auth'])
        ->name('settings.index');

    Route::patch('/parametres/account', [SettingsController::class, 'updateAccount'])->middleware(['auth'])
        ->name('settings.account.update');

    Route::patch('/parametres/password', [SettingsController::class, 'updatePassword'])->middleware(['auth'])
        ->name('settings.password.update');

    Route::patch('/parametres/general', [SettingsController::class, 'updateGeneral'])->middleware(['auth'])
        ->name('settings.general.update');

    Route::patch('/parametres/notifications', [SettingsController::class, 'updateNotifications'])->middleware(['auth'])
        ->name('settings.notifications.update');

    // ============================================
    // NOTIFICATIONS
    // ============================================
    Route::get('/notifications', [NotificationsController::class, 'index'])->middleware(['auth'])
        ->name('notifications.index');

    Route::get('/notifications/unread-count', [NotificationsController::class, 'getUnreadCount'])->middleware(['auth'])
        ->name('notifications.unread-count');

    Route::patch('/notifications/{notification}/mark-as-read', [NotificationsController::class, 'markAsRead'])->middleware(['auth'])
        ->name('notifications.mark-as-read');

    Route::patch('/notifications/mark-all-as-read', [NotificationsController::class, 'markAllAsRead'])->middleware(['auth'])
        ->name('notifications.mark-all-as-read');

    Route::post('/notifications/bulk-destroy', [NotificationsController::class, 'bulkDestroy'])->middleware(['auth'])
        ->name('notifications.bulk-destroy');

    Route::delete('/notifications/{notification}', [NotificationsController::class, 'destroy'])->middleware(['auth'])
        ->name('notifications.destroy');

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

// REMPLIR
Route::get('/enquetes/remplir/{jeton}', [SurveyController::class, 'participantFill'])->name('survey.fill.participants');
Route::post('/enquetes/remplir/{jeton}', [SurveyController::class, 'submitFillPublic'])->name('surveys.fill.submit.public');

require __DIR__.'/auth.php';
