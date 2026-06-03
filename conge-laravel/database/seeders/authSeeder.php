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
        $users = [
            [
                'email' => 'directeur@ofppt.ma',
                'nom' => 'Directeur',
                'prenom' => 'OFPPT',
                'role' => 'directeur',
                'efp_travail' => 1,
            ],
            [
                'email' => 'responsable@ofppt.ma',
                'nom' => 'Responsable',
                'prenom' => 'OFPPT',
                'role' => 'manager',
                'efp_travail' => 1,
            ],
            [
                'email' => 'employe@ofppt.ma',
                'nom' => 'Employe',
                'prenom' => 'OFPPT',
                'role' => 'employee',
                'efp_travail' => 1,
            ],
            [
                'email' => 'scanovasolutions@gmail.com',
                'nom' => 'Directeur',
                'prenom' => 'mechrafi',
                'role' => 'directeur',
                'efp_travail' => 1,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    ...$user,
                    'password' => Hash::make('demo123'),
                    'actif' => true,
                ]
            );
        }

    }
}
