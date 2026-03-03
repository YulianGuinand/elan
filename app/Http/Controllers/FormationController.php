<?php

namespace App\Http\Controllers;

use App\Models\Formations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $query = Formations::query();

    if ($request->has('search')) {
      $search = $request->input('search');
      $query->where('libelle', 'like', "%{$search}%");
    }

    // Pagination avec option de recherche
    $formations = $query->latest()->paginate(10)->withQueryString();

    return Inertia::render('Formations/Index', [
      'formations' => $formations,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Formations/Create');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'libelle' => 'required|string|max:255',
    ]);

    Formations::create($validated);

    return redirect()->route('formations.index')->with('success', 'Formation ajoutée avec succès.');
  }

  /**
   * Display the specified resource.
   */
  public function show(Formations $formation)
  {
    // On pourrait charger les contrats associés et d'autres informations
    $formation->load(['contrats.participant', 'contrats.entreprise', 'contrats.ecole', 'ecoles']);

    return Inertia::render('Formations/Show', [
      'formation' => $formation
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Formations $formation)
  {
    return Inertia::render('Formations/Edit', [
      'formation' => $formation
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Formations $formation)
  {
    $validated = $request->validate([
      'libelle' => 'required|string|max:255',
    ]);

    $formation->update($validated);

    return redirect()->route('formations.index')->with('success', 'Formation mise à jour avec succès.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Formations $formation)
  {
    $formation->delete();

    return redirect()->route('formations.index')->with('success', 'Formation supprimée avec succès.');
  }

  /**
   * Remove multiple resources from storage.
   */
  public function bulkDestroy(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:formations,id',
    ]);

    Formations::whereIn('id', $request->ids)->delete();

    return redirect()->route('formations.index')->with('success', count($request->ids) . ' formations ont été supprimées.');
  }
}
