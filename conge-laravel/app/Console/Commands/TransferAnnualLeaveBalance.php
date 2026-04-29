<?php

namespace App\Console\Commands;

use App\Models\soldeConge;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TransferAnnualLeaveBalance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:transfer-annual-leave-balance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
   public function handle()
{
    $today = now();

    $users = User::whereIn('role', ['employee', 'manager'])->get();

    foreach ($users as $user) {

        $recruitmentDate = Carbon::parse($user->date_recrutement);

        if (
            $today->day == $recruitmentDate->day &&
            $today->month == $recruitmentDate->month &&
            $user->solde_annee_precedente >= 22
        ) {

            $soldeConge = SoldeConge::where('user_id', $user->id)->first();

            if (!$soldeConge) continue;

            $nouveauSoldeDerniere =
                $soldeConge->solde_restant - $user->solde_annee_derniere;

            $nouveauSoldeDerniere = max(0, $nouveauSoldeDerniere);

            $user->solde_annee_derniere = $nouveauSoldeDerniere;
            $user->solde_annee_precedente = 0;
            $user->save();

            $soldeConge->solde_utilise = 0;
            $soldeConge->total_annuel = 0;
            $soldeConge->solde_restant = $nouveauSoldeDerniere;
            $soldeConge->save();
        }
    }

    return Command::SUCCESS;
}
}
