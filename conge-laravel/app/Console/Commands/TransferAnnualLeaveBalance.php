<?php

namespace App\Console\Commands;

use App\Models\SoldeConge;
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
    protected $signature = 'leave:transfer-balance';

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

        if (!$user->date_recrutement) {
            continue;
        }

        $recruitmentDate = Carbon::parse($user->date_recrutement);

        if (
            // $today->day == $recruitmentDate->day &&
            // $today->month == $recruitmentDate->month &&
            (float) $user->solde_annee_precedente >= 22
        ) {
            $soldeConge = SoldeConge::where('user_id', $user->id)->first();

            if (!$soldeConge) {
                continue;
            }

            $soldeATransferer = (float) $user->solde_annee_precedente;

            $user->solde_annee_derniere = $soldeATransferer;
            $user->solde_annee_precedente = 0;
            $user->save();

            $soldeConge->solde_utilise = 0;
            $soldeConge->total_annuel = $soldeATransferer;
            $soldeConge->solde_restant = $soldeATransferer;
            $soldeConge->save();
        }
    }

    return Command::SUCCESS;
}

}
