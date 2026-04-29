<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AddMonthlyLeaveSolde extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leave:add-monthly-solde';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add 2 leave days monthly from recruitment date';

    /**
     * Execute the console command.
     */
    public function handle()
    {

    $today = now();

    $users = User::whereIn('role', ['employee', 'manager'])
        ->where('actif', true)
        ->whereNotNull('date_recrutement')
        ->get();

    foreach ($users as $user) {
        $recruitmentDate = Carbon::parse($user->date_recrutement);

        $dayToRun = min($recruitmentDate->day, $today->daysInMonth);

        if ((int) $today->day === (int) $dayToRun) {
            $daysToAdd = in_array($today->month, [6, 12]) ? 1 : 2;

            
            $user->solde_annee_precedente = min(
            $user->solde_annee_precedente + $daysToAdd,
            22);
            $user->save();
        }
    }

    return Command::SUCCESS;

    }
}
