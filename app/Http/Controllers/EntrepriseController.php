<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class EntrepriseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $entreprises = Entreprise::all();
        return view('entreprise.index', compact('entreprises'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('entreprise.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try
        {
            $raison_social = $request->input('raison_social');
            $telephone = $request->input('telephone');
            $mail = $request->input('mail');
            $ville = $request->input('ville');
            $interlocuteur = $request->input('interlocuteur');
            Entreprise::create([
                'raison_social' => $raison_social,
                'mail' => $mail,
                'telephone' => $telephone,
                'ville' => $ville,
                'interlocuteur' => $interlocuteur,
            ]);
            return redirect()->route('entreprise.index');
        }
        catch (\Exception $exception)
        {
            Log::error("Erreur de l'ajout de l'entreprise : " . $exception->getMessage());
            return redirect()->route('entreprise.index')->with('error', $exception->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
