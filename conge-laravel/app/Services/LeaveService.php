<?php

namespace App\Services;

use App\Models\Holiday;
use Carbon\Carbon;

class LeaveService
{
    public function calculateDays($start, $end)
    {
        $days = 0;

        $current = Carbon::parse($start);
        $endDate = Carbon::parse($end);

        while ($current <= $endDate) {

            $isWeekend = $current->isWeekend();

            $isHoliday = Holiday::whereDate('date', $current)->exists();

            if (!$isWeekend && !$isHoliday) {
                $days++;
            }

            $current->addDay();
        }

        return $days;
    }

    // deduction solde
 public function consumeSolde($user, $days, $type)
{
    $solde = $user->soldeConge;

    // Congé exceptionnel => no deduction
    if ($type !== 'administratif') {

        return [
            'success' => true,
            'message' => 'Congé exceptionnel - aucun solde consommé',
            'solde' => $solde
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | vérification solde restant
    |--------------------------------------------------------------------------
    */

    if ($solde->solde_restant < $days) {

        return [
            'success' => false,
            'message' => 'Solde insuffisant'
        ];
    }

    $remaining = $days;

    /*
    |--------------------------------------------------------------------------
    | 1. deduction année dernière (table users)
    |--------------------------------------------------------------------------
    */

    if ($user->solde_annee_derniere >= $remaining) {

        $user->solde_annee_derniere -= $remaining;

        $remaining = 0;

    } else {

        $remaining -= $user->solde_annee_derniere;

        $user->solde_annee_derniere = 0;
    }

    /*
    |--------------------------------------------------------------------------
    | 2. deduction année précédente (table users)
    |--------------------------------------------------------------------------
    */

    if ($remaining > 0) {

        $user->solde_annee_precedente -= $remaining;
    }

    /*
    |--------------------------------------------------------------------------
    | update solde_conges
    |--------------------------------------------------------------------------
    */

    $solde->solde_utilise += $days;

    $solde->solde_restant =
        $user->solde_annee_derniere +
        $user->solde_annee_precedente;

    /*
    |--------------------------------------------------------------------------
    | save
    |--------------------------------------------------------------------------
    */

   $user->update([
    'solde_annee_derniere' => $user->solde_annee_derniere,
    'solde_annee_precedente' => $user->solde_annee_precedente,
]);

$solde->update([
    'solde_utilise' => $solde->solde_utilise,
    'solde_restant' => $solde->solde_restant,
]);

    return [
        'success' => true,
        'solde' => $solde
    ];
}
}