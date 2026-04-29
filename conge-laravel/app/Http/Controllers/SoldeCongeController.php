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
            'user' => $user,
            'solde' => $solde,
        ]);
    }

    public function show(User $user)
    {
        $solde = SoldeConge::where('user_id', $user->id)->first();

        return response()->json([
            'user' => $user,
            'solde' => $solde,
        ]);
    }
}
