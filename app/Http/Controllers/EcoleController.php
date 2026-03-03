<?php

namespace App\Http\Controllers;

use App\Models\Ecole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EcoleController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $query = Ecole::query();

    if ($request->filled('search')) {
      $search = $request->input('search');
      $query->where('libelle', 'like', "%{$search}%")
        ->orWhere('ville', 'like', "%{$search}%");
    }

    $ecoles = $query->orderBy('libelle', 'asc')->paginate(10)->withQueryString();

    return Inertia::render('Ecoles/Index', [
      'ecoles' => $ecoles,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Ecoles/Create');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'libelle' => 'required|string|max:255',
      'adresse' => 'required|string|max:255',
      'code_postal' => 'required|string|max:10',
      'ville' => 'required|string|max:255',
    ]);

    Ecole::create($validated);

    return redirect()->route('ecoles.index')->with('success', 'École créée avec succès.');
  }

  /**
   * Display the specified resource.
   */
  public function show(Ecole $ecole)
  {
    return Inertia::render('Ecoles/Show', [
      'ecole' => $ecole
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Ecole $ecole)
  {
    return Inertia::render('Ecoles/Edit', [
      'ecole' => $ecole
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Ecole $ecole)
  {
    $validated = $request->validate([
      'libelle' => 'required|string|max:255',
      'adresse' => 'required|string|max:255',
      'code_postal' => 'required|string|max:10',
      'ville' => 'required|string|max:255',
    ]);

    $ecole->update($validated);

    return redirect()->route('ecoles.index')->with('success', 'École modifiée avec succès.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Ecole $ecole)
  {
    $ecole->delete();
    return redirect()->route('ecoles.index')->with('success', 'École supprimée avec succès.');
  }

  /**
   * Remove multiple resources from storage.
   */
  public function bulkDestroy(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:ecoles,id'
    ]);

    Ecole::whereIn('id', $request->ids)->delete();

    return redirect()->route('ecoles.index')->with('success', 'Écoles supprimées avec succès.');
  }
}
