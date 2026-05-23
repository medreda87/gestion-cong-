<?php

namespace App\Http\Controllers;

use App\Models\Parameter;
use Illuminate\Http\Request;

class ParameterController extends Controller
{
    // afficher paramétrage dyal user connecté
    public function index()
    {
        $parametrage = Parameter::where('user_id', auth()->id())->first();

        return response()->json($parametrage);
    }

    // ajouter paramétrage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cfpt_code' => 'required|string',
            'direction_code' => 'required|string',
            'delegation_number' => 'required|string',
            'delegation_date' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        $parametrage = Parameter::create($validated);

        return response()->json([
            'message' => 'Paramétrage créé avec succès',
            'data' => $parametrage
        ], 201);
    }

    // modifier
    public function update(Request $request, $id)
    {
        $parametrage = Parameter::where('user_id', auth()->id())
            ->findOrFail($id);

        $validated = $request->validate([
            'cfpt_code' => 'required|string',
            'direction_code' => 'required|string',
            'delegation_number' => 'required|string',
            'delegation_date' => 'required|date',
        ]);

        $parametrage->update($validated);

        return response()->json([
            'message' => 'Paramétrage modifié avec succès',
            'data' => $parametrage
        ]);
    }

    // supprimer
    public function destroy($id)
    {
        $parametrage = Parameter::where('user_id', auth()->id())
            ->findOrFail($id);

        $parametrage->delete();

        return response()->json([
            'message' => 'Paramétrage supprimé'
        ]);
    }
}
