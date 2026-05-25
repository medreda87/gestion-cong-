<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;
use App\Models\Demande;
use App\Models\SoldeConge;
use App\Models\User;
use Carbon\Carbon;

class HolidayController extends Controller
{
    public function index()
    {
        return response()->json(
            Holiday::orderBy('date')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'date' => 'required|date',
            'is_recurring' => 'boolean'
        ]);

        $holiday = Holiday::create([
            'name' => $request->name,
            'type' => $request->type,
            'date' => $request->date,
            'is_recurring' => $request->is_recurring ?? true,
        ]);

        $this->recalculateAllDemandes();

        return response()->json($holiday, 201);
    }

    public function update(Request $request, string $id)
    {
        $holiday = Holiday::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'is_recurring' => 'boolean'
        ]);

        $holiday->update([
            'name' => $request->name,
            'date' => $request->date,
            'is_recurring' => $request->is_recurring ?? true,
        ]);

        $this->recalculateAllDemandes();

        return response()->json($holiday);
    }

    public function destroy(string $id)
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();

        $this->recalculateAllDemandes();

        return response()->json([
            'message' => 'Holiday deleted successfully'
        ]);
    }
public function recalculateAllDemandes()
{
    $demands = Demande::where('status', 'approved')->get();

    foreach ($demands as $demande) {

        if (!$demande->start_date || !$demande->end_date) {
            continue;
        }

        $oldDuration = (int) $demande->duration;

        $newDuration = $this->calculateWorkingDays(
            $demande->start_date,
            $demande->end_date
        );

        // ila makayn ta changement
        if ($oldDuration == $newDuration) {
            continue;
        }

        $difference = $oldDuration - $newDuration;

        // update demande
        $demande->duration = $newDuration;
        $demande->save();

        // get solde
        $solde = SoldeConge::where('user_id', $demande->user_id)->first();

        if (!$solde) {
            continue;
        }

        // update soldes
        $solde->solde_utilise -= $difference;
        $solde->solde_restant += $difference;

        $solde->save();

        /*
        |--------------------------------------------------------------------------
        | Modification jdida f table users
        |--------------------------------------------------------------------------
        */

        $user = User::find($demande->user_id);

        if ($user && $difference > 0) {

            // ila kayn solde année dernière
            if ($user->solde_annee_derniere > 0) {

                $user->solde_annee_derniere += $difference;

            } else {

                // sinon zidha f année précédente
                $user->solde_annee_precedent += $difference;
            }

            $user->save();
        }
    }
}
    public function calculateWorkingDays($startDate, $endDate)
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $holidays = Holiday::pluck('date')
            ->filter()
            ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();
        $days = 0;
        while ($start <= $end) {

            $date = $start->format('Y-m-d');

            if (!$start->isWeekend() && !in_array($date, $holidays)) {
                $days++;
            }

            $start->addDay();
        }
        return $days;
    }
}