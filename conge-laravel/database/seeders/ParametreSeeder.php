<?php

namespace Database\Seeders;

use App\Models\Parameter;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParametreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    $user = User::where('role', 'directeur')->first();

    Parameter::updateOrCreate(
    ['user_id' => $user->id],
    [
        'cfpt_code' => 'ISTA-TNG',
        'direction_code' => 'DR-TNG',
        'delegation_number' => 'DEC-2026-015',
        'delegation_date' => '2026-01-15',
    ]
);
    }
}
