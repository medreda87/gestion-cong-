<?php

namespace Database\Seeders;

use App\Models\SoldeConge;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class soldeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = User::whereIn('role', ['employee', 'manager'])->get();

        foreach ($users as $user) {

            SoldeConge::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'total_annuel'   => 22,
                    'solde_utilise'  => 0,
                    'solde_restant'  => 22,
                ]
            );
        }

        $this->command->info('SoldeConge records created successfully.');
    }
}
