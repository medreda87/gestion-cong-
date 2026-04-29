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
                'nom' => 'Employee',
                'prenom' => 'User',
                'password' => Hash::make('demo123'),
                'role' => 'employee',
            ]
        );

        User::updateOrCreate(
            ['email' => 'responsable@ofppt.com'],
            [
                'nom' => 'Responsable',
                'prenom' => 'User',
                'password' => Hash::make('demo123'),
                'role' => 'manager',
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
