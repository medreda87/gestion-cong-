<?php

namespace App\Http\Controllers;

use App\Mail\DemandeCongeNotification;
use App\Models\Demande;
use App\Models\User;
use App\Notifications\DirectorLeaveRequestNotification;
use App\Notifications\EmployeeCancelledNotification;
use App\Notifications\LeaveStatusChangedNotification;
use App\Notifications\ManagerCancelledNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class DemandeController extends Controller
{
public function getdemande()
{
    $user = auth('api')->user();

   

    $query = Demande::with('user')->orderBy('id', 'desc');

    if ($user->role === 'manager') {

        $query->where('status', 'pending_manager')
              ->whereHas('user', function ($q) use ($user) {
                  $q->where('efp_travail', $user->efp_travail);
              });

    } elseif ($user->role === 'directeur') {

        $query->whereIn('status', ['pending_director','approved']);
    }

    return response()->json([
        'demandes' => $query->get()
    ]);
}

public function getDemandeHistory()
{
    $user = auth('api')->user();

    $query = Demande::with('user')->orderBy('id', 'desc');

    // RESPONSABLE
    if ($user->role === 'manager') {

        $query->whereHas('user', function ($q) use ($user) {
            $q->where('efp_travail', $user->efp_travail);
        })
        ->whereIn('status', ['pending_director', 'approved']);
    }

    // DIRECTEUR
    elseif ($user->role === 'directeur') {

        $query->where('status', 'approved');
    }

    // EMPLOYEE
    else {

        $query->where('user_id', $user->id);
    }

    return response()->json([
        'demandes' => $query->get()
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
        $demande->load('user');

        $users = User::where('efp_travail', $user->efp_travail)->get();

        // managers / responsables
        $managers = $users->where('role', 'manager');
        // interimaire(s)
        $interimaires = $users->where('role', 'employee');

        if ($user->role === 'manager') {

            $director = User::where('role', 'directeur')->first();

            if (!$director) {
                return response()->json([
                    'error' => 'Director not found'
                ], 500);
            }

            $director->notify(new DirectorLeaveRequestNotification($demande,'manager_self'));
            }else{
            // employee -> managers
            foreach($managers as $manager){
                Mail::to($manager->email)
                    ->send(new DemandeCongeNotification($demande, $user));
            }

            // employee -> interimaires
            foreach($interimaires as $interimaire){
                Mail::to($interimaire->email)
                    ->send(new DemandeCongeNotification($demande, $user));
            }
        }

            return response()->json([
            'responsable_id' => $user->responsable_id,
            'interimaire_id' => $user->interimaire_id,
            ]);
        }

  public function updateStatus(Request $request, string $id)
{
    $user = auth('api')->user();

    // ✅ Eager-load the user relation
    $demande = Demande::with('user')->findOrFail($id);

    $validated = $request->validate([
        'status' => 'required|in:pending_director,approved,cancelled',
        'comment' => 'nullable|string',
    ]);

    /*
    |-----------------------------------
    | MANAGER VALIDATION
    |-----------------------------------
    */
    if ($user->role === 'manager' && $validated['status'] === 'pending_director') {

        $demande->manager_comment = $validated['comment'];
        $demande->status = 'pending_director';
        $demande->save();

        $director = User::where('role', 'directeur')->first();

        if ($director) {
            $director->notify(new DirectorLeaveRequestNotification($demande,'from_manager'));
        }

        $demande->user->notify(
            new LeaveStatusChangedNotification($demande, 'pending_director')
        );
    }

    return response()->json([
        'message' => 'Status updated',
        'demande' => $demande
    ]);
}

    public function cancel(string $id)
{
    $demande = Demande::with('user')->findOrFail($id);

    $demande->status = 'cancelled';
    $demande->save();

    // employee cancels → notify manager
    if ($demande->user->role === 'employee') {
        $managers = User::where('role', 'manager')
            ->where('efp_travail', $demande->user->efp_travail)
            ->get();

        foreach ($managers as $manager) {
            $manager->notify(new EmployeeCancelledNotification($demande));
        }
    }

    // manager cancels → notify director
    elseif ($demande->user->role === 'manager') {
        $director = User::where('role', 'directeur')->first();

        if ($director) {
            $director->notify(new ManagerCancelledNotification($demande));
        }
    }
}

    public function detsroy(string $id){
        $demande = Demande::findOrFail($id);
        $demande->delete();
    }   
}
