<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class authSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    
        User::updateOrCreate(
            ['email' => 'scanovasolutions@gmail.com'],
            [
                'nom' => 'Directeur',
                'prenom' => 'mechrafi',
                'password' => Hash::make('demo123'),
                'role' => 'directeur',
            ]
        );

    }
}
