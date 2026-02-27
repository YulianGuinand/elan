<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StudentsController;
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
        Route::get('/', [SurveyController::class, 'index'])
            ->name('surveys.index');

        Route::get('/creer', [SurveyController::class, 'create'])
            ->name('surveys.create')->middleware(["is_admin", "is_superAdmin"]);

        Route::post('/constructeur', [SurveyController::class, 'storeFromBuilder'])
            ->name('surveys.builder.store')->middleware(["is_admin", "is_superAdmin"]);
    });

    // ============================================
    // PARTICIPANTS
    // ============================================
    Route::prefix('participants')->group(function () {
        Route::get('/', [StudentsController::class, 'index'])
            ->name('participants.index');

        Route::get('/ajouter', function () {
            return Inertia::render('Participants/Create');
        })->middleware(["is_superadmin"])->name('participants.create');
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
