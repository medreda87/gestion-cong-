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
            ['email' => 'employee@ofppt.com'],
            [
                'nom' => 'employee',
                'prenom' => 'User',
                'password' => Hash::make('demo123'),
                'date_recrutement' => now()
            ]
        );

         User::updateOrCreate(
            ['email' => 'responsable@ofppt.com'],
            [
                'nom' => 'responsable',
                'prenom' => 'User',
                'password' => Hash::make('demo123'),
                'date_recrutement' => now()
                
            ]
        );

        User::updateOrCreate(
            ['email' => 'directeur@ofppt.com'],
            [
                'nom' => 'Directeur',
                'prenom' => 'User',
                'password' => Hash::make('demo123'),
                'role' => 'directeur',
            ]
        );

    }
}
