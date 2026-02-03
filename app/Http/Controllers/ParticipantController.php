<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Participant;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $participants = Participant::all();
        return view('Participant.index', compact('participants'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('Participant.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try
        {
            $nom = $request->input('nom');
            $prenom = $request->input('prenom');
            $telephone = $request->input('telephone');
            $mail = $request->input('mail');
            Participant::create([
                'nom' => $nom,
                'prenom' => $prenom,
                'telephone' => $telephone,
                'mail' => $mail
            ]);
            return redirect()->route('Participant.index');
        }
        catch (\Exception $e)
        {
            Log::error("Erreur de l'ajout du participant : " . $e->getMessage());
            return redirect()->route('Participant.index')->with("error",'Erreur de l\'ajout du participant : ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $participant = Participant::find($id);
        return view('Participant.show', compact('participant'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $participant = Participant::find($id);
        return view('Participant.edit', compact('participant'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try
        {
            Participant::find($id)
                ->update($request->all());
            return redirect()->route('Participant.index');
        }
        catch (\Exception $e)
        {
            Log::error("Erreur de la modification du participant : " . $e->getMessage());
            return redirect()->route('Participant.index')->with("error",'Erreur de la modification du participant : ' . $e->getMessage());
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try
        {
            Participant::destroy($id);
            return redirect()->route('Participant.index');
        }
        catch (\Exception $e)
        {
            Log::error("Erreur de la suppression du participant : " . $e->getMessage());
            return redirect()->route('Participant.index')->with("error",'Erreur de suppression du participant : ' . $e->getMessage());
        }
    }
}
