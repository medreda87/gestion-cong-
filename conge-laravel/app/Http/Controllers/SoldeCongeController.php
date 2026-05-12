<?php

namespace App\Http\Controllers;

use App\Models\SoldeConge;
use App\Models\User;
use Illuminate\Http\Request;

class SoldeCongeController extends Controller
{
    public function mySolde()
{
    $user = auth('api')->user();

    $solde = SoldeConge::where('user_id', $user->id)->first();

    return response()->json([
        'solde_annee_precedente' => $solde->solde_annee_precedente ?? 0,

        'solde_annee_derniere' => $user->solde_annee_derniere ?? 0,

        'total_annuel' =>
            ($solde->solde_annee_precedente ?? 0)
            + ($user->solde_annee_derniere ?? 0),

        'solde_utilise' => $solde->solde_utilise ?? 0,

        'solde_restant' => $solde->solde_restant ?? 0,
    ]);
}

   public function show(User $user)
{
    $solde = SoldeConge::where('user_id', $user->id)->first();

    return response()->json([
        'user' => $user,

        'solde_annee_precedente' => $solde->solde_annee_precedente ?? 0,

        'solde_annee_derniere' => $user->solde_annee_derniere ?? 0,

        'total_annuel' =>
            ($solde->solde_annee_precedente ?? 0)
            + ($user->solde_annee_derniere ?? 0),

        'solde_utilise' => $solde->solde_utilise ?? 0,

        'solde_restant' => $solde->solde_restant ?? 0,
    ]);
}
    
}
