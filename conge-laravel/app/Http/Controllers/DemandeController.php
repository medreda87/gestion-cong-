<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function getdemande()
{
     $user = auth('api')->user();

    if ($user->role === 'manager') {
        $demandes = Demande::with('user')
        ->where(function ($query) use ($user) {
            $query->where('status', 'pending_manager')
                  ->orWhere('user_id', $user->id); 
        })
        ->orderBy('id', 'desc')
        ->get();
    } elseif ($user->role === 'directeur') {
        $demandes = Demande::with('user')
            ->where('status', 'pending_director')
            ->orderBy('id', 'desc')
            ->get();
    } else {
        $demandes = Demande::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();
    }

    return response()->json([
        'demandes' => $demandes
    ]);
}

    public function store(Request $request){
        $user = auth('api')->user();

        $validated = $request->validate([
            'type' => 'required|string',
            'sub_type' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'duration' => 'required|integer|min:1',
            'reason' => 'nullable|string',
            'interimaire_id' => 'nullable|exists:users,id',
        ]);

        $demande = Demande::create([
            'user_id' => $user->id,
            'type' => $validated['type'],
            'sub_type' => $validated['sub_type'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'duration' => $validated['duration'],
            'reason' => $validated['reason'] ?? null,
            'interimaire_id' => $validated['interimaire_id'] ?? null,
            'status' => $user->role === 'manager'
                ? 'pending_director'
                : 'pending_manager',
        ]);

        return response()->json([
            'message' => 'Demande créée avec succès',
            'demande' => $demande,
        ], 201);
    }

    public function updateStatus(Request $request,string $id){
      $user = auth('api')->user();

    $demande = Demande::findOrFail($id);

    $validated = $request->validate([
        'status' => 'required|in:pending_manager,pending_director,approved,rejected,cancelled',
        'comment' => 'nullable|string',
    ]);

    
    if ($user->role === 'manager' && $validated['status'] === 'pending_director') {
        $demande->manager_comment = $validated['comment'];
    }

    if ($user->role === 'director' && in_array($validated['status'], ['approved', 'rejected'])) {
        $demande->director_comment = $validated['comment'];
    }

    $demande->status = $validated['status'];
    $demande->save();

    return response()->json([
        'message' => 'Status updated',
        'demande' => $demande
    ]);
    }

    public function cancel(string $id){
        $demande = Demande::findOrFail($id);

        $demande->status = 'canceled';
        $demande->save();
    }

    public function detsroy(string $id){
        $demande = Demande::findOrFail($id);
        $demande->delete();
    }   
}
