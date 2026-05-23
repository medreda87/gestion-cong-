<?php

namespace Database\Seeders;

use App\Models\DetailJobUser;
use App\Models\DetailUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class detailsDirecteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DetailUser::updateOrCreate(
    ['user_id' => 1],
    [
        'sexe' => 'Homme',
        'cin' => 'AB123456',
        'date_naissance' => '1980-05-15',
        'adresse' => 'Quartier Administratif, Tanger',
        'ville' => 'Tanger',
        'telephone' => '0612345678',
        'photo' => 'directeur.jpg',
    ]
);


    DetailJobUser::updateOrCreate(
    ['user_id' => 1],
    [
        'fonction' => 'Directeur',
        'nature_fonction' => 'Administration',
        'echelle' => '11',
        'categorie' => 'A',
        'grade' => 1,
        'diplome' => 'Master en Informatique',
        'specialite' => 'Gestion des Systèmes d’Information',
        'date_recrutement' => '2010-09-01',
        'date_prise_service' => '2012-01-15',
        'recode_annee_ant' => 5,
    ]
);
    }
}
