<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Models\Ecole;
use App\Models\Entreprise;
use App\Models\Formations;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContratController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $query = Contrat::with(['participant', 'ecole', 'entreprise', 'formation']);

    if ($request->has('search')) {
      $search = $request->input('search');
      $query->whereHas('participant', function ($q) use ($search) {
        $q->where('nom', 'like', "%{$search}%")
          ->orWhere('prenom', 'like', "%{$search}%");
      });
    }

    $contrats = $query->latest()->paginate(10)->withQueryString();

    return Inertia::render('Contrats/Index', [
      'contrats' => $contrats,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    // On a besoin de données pour les listes déroulantes
    $participants = Participant::select('id', 'nom', 'prenom', 'role')
      ->orderBy('nom')
      ->get();

    $ecoles = Ecole::select('id', 'libelle')
      ->orderBy('libelle')
      ->get();

    $entreprises = Entreprise::select('id', 'raison_sociale')
      ->orderBy('raison_sociale')
      ->get();

    $formations = Formations::select('id', 'libelle')
      ->orderBy('libelle')
      ->get();

    return Inertia::render('Contrats/Create', [
      'participants' => $participants,
      'ecoles' => $ecoles,
      'entreprises' => $entreprises,
      'formations' => $formations,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'participant_id' => 'required|exists:participants,id',
      'formation_id' => 'required|exists:formations,id',
      'ecole_id' => 'required|exists:ecoles,id',
      'entreprise_id' => 'nullable|exists:entreprises,id',
      'date_entree' => 'required|date',
      'date_sortiee' => 'nullable|date|after_or_equal:date_entree',
    ]);

    $validated['utilisateur_id'] = Auth::id();

    Contrat::create($validated);

    return redirect()->route('contrats.index')->with('success', 'Contrat créé avec succès.');
  }

  /**
   * Display the specified resource.
   */
  public function show(Contrat $contrat)
  {
    $contrat->load(['participant', 'ecole', 'entreprise', 'formation']);

    return Inertia::render('Contrats/Show', [
      'contrat' => $contrat
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Contrat $contrat)
  {
    abort_if(Auth::user()->role === 'admin' && $contrat->utilisateur_id !== Auth::id(), 403, 'Vous ne pouvez modifier que les contrats que vous avez créés.');

    $participants = Participant::select('id', 'nom', 'prenom', 'role')->orderBy('nom')->get();
    $ecoles = Ecole::select('id', 'libelle')->orderBy('libelle')->get();
    $entreprises = Entreprise::select('id', 'raison_sociale')->orderBy('raison_sociale')->get();
    $formations = Formations::select('id', 'libelle')->orderBy('libelle')->get();

    return Inertia::render('Contrats/Edit', [
      'contrat' => $contrat,
      'participants' => $participants,
      'ecoles' => $ecoles,
      'entreprises' => $entreprises,
      'formations' => $formations,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Contrat $contrat)
  {
    abort_if(Auth::user()->role === 'admin' && $contrat->utilisateur_id !== Auth::id(), 403, 'Vous ne pouvez modifier que les contrats que vous avez créés.');

    $validated = $request->validate([
      'participant_id' => 'required|exists:participants,id',
      'formation_id' => 'required|exists:formations,id',
      'ecole_id' => 'required|exists:ecoles,id',
      'entreprise_id' => 'nullable|exists:entreprises,id',
      'date_entree' => 'required|date',
      'date_sortiee' => 'nullable|date|after_or_equal:date_entree',
    ]);

    $contrat->update($validated);

    return redirect()->route('contrats.index')->with('success', 'Contrat mis à jour avec succès.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Contrat $contrat)
  {
    abort_if(Auth::user()->role === 'admin' && $contrat->utilisateur_id !== Auth::id(), 403, 'Vous ne pouvez supprimer que les contrats que vous avez créés.');

    $contrat->delete();
    return redirect()->route('contrats.index')->with('success', 'Contrat supprimé avec succès.');
  }
}
