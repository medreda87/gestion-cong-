<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Services\LeaveService;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function validateLeave($id, LeaveService $service)
{
    $leave = Demande::findOrFail($id);
    $user = $leave->user;

    // calculate days
    $days = $service->calculateDays(
        $leave->start_date,
        $leave->end_date
    );

    // safety check (IMPORTANT)
    if (!$user->soldeConge) {
        return response()->json([
            'message' => 'Solde non initialisé pour cet utilisateur'
        ], 400);
    }

    // consume
    $result = $service->consumeSolde($user, $days);

    if (!$result['success']) {
        return response()->json([
            'message' => $result['message']
        ], 400);
    }

    // update leave
    $leave->status = 'approved';
    $leave->duration = $days;
    $leave->save();

    return response()->json([
        'message' => 'Demande validée avec succès',
        'days_used' => $days,
        'solde' => $result['solde']
    ]);
}
}