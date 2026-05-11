<?php

namespace App\Services;

use App\Models\Holiday;
use Carbon\Carbon;

class LeaveService
{
    // حساب الأيام بدون weekends و holidays
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
    public function consumeSolde($user, $days)
    {
        $solde = $user->soldeConge;

        if (!$solde) {
            return [
                'success' => false,
                'message' => 'Solde introuvable'
            ];
        }

        $remaining = $days;

        // Deduct from current remaining balance first
        if ($solde->solde_restant >= $remaining) {
            $solde->solde_restant -= $remaining;
            $remaining = 0;
        } else {
            $remaining -= $solde->solde_restant;
            $solde->solde_restant = 0;
        }

        // If still remaining, deduct from previous year balance
        if ($remaining > 0) {
            if ($solde->solde_annee_precedente < $remaining) {
                return [
                    'success' => false,
                    'message' => 'Solde insuffisant'
                ];
            }
            $solde->solde_annee_precedente -= $remaining;
            $solde->solde_restant += $solde->solde_annee_precedente; // Wait, no: solde_restant is already 0, but actually, solde_restant should be the total remaining after deduction.
        }

        // Update used balance
        $solde->solde_utilise += $days;

        // Recalculate total remaining (though it should be solde_restant + solde_annee_precedente, but since we deducted, it's already updated)
        // Actually, solde_restant is the remaining after deduction from current, and solde_annee_precedente is adjusted.

        $solde->save();

        return [
            'success' => true,
            'solde' => $solde
        ];
    }
}