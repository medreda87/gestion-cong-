<?php

namespace App\Imports;

use App\Models\SoldeConge;
use App\Models\User;
use App\Models\DetailJobUser;
use App\Models\DetailUser;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{
public function model(array $row)
{
    $user = User::firstOrCreate(
        [
            'email' => $row['email'] ?? null,
        ],
        [
            'matricule' => $row['matricule'] ?? null,
            'nom' => $row['nom'] ?? null,
            'prenom' => $row['prenom'] ?? null,
            'nom_prenom' => $row['nom_prenom'] ?? null,
            'nom_ar' => $row['nom_ar'] ?? null,
            'prenom_ar' => $row['prenom_ar'] ?? null,

            'genre' => $row['genre'] ?? null,
            'actif' => $row['actif'] ?? 1,

            'affectation' => $row['affectation'] ?? null,
            'efp_travail' => $row['efp_travail'] ?? null,

            'email' => $row['email'] ?? null,
            'password' => Hash::make('12345678'),

            'observation' => $row['observation'] ?? null,

            'role' => $row['role'] ?? 'employee',
        ]
    );

    // ======================
    // detail_users
    // ======================

    DetailUser::updateOrCreate(
        ['user_id' => $user->id],
        [
            'sexe' => $row['genre'] ?? null,
            'cin' => $row['cin'] ?? null,

            'date_naissance' => $this->formatDate(
                $row['date_naissance'] ?? null
            ),

            'adresse' => $row['adresse'] ?? null,
            'ville' => $row['ville'] ?? null,
            'telephone' => $row['telephone'] ?? null,
            'photo' => $row['photo'] ?? null,
        ]
    );

    // ======================
    // detail_job_users
    // ======================

    DetailJobUser::updateOrCreate(
        ['user_id' => $user->id],
        [
            'fonction' => $row['fonction'] ?? null,

            'nature_fonction' => $row['nature_fonction'] ?? null,

            'echelle' => $row['echelle'] ?? null,

            'categorie' => $row['categorie'] ?? null,

            'grade' => $row['grade'] ?? null,

            'diplome' => $row['diplome'] ?? null,

            'specialite' => $row['specialite'] ?? null,

            'date_recrutement' => $this->formatDate(
                $row['date_recrutement'] ?? null
            ),

            'date_prise_service' => $this->formatDate(
                $row['date_prise_service'] ?? null
            ),

            'recode_annee_ant' => $row['recode_annee_ant'] ?? null,
        ]
    );

    // ======================
    // solde conge
    // ======================

    $soldePrecedent = $row['solde_annee_precedente'] ?? 0;
    $soldeDerniere = $row['solde_annee_derniere'] ?? 0;

    SoldeConge::updateOrCreate(
        ['user_id' => $user->id],
        [
            'solde_annee_precedente' => $soldePrecedent,
            'total_annuel' => $soldePrecedent + $soldeDerniere,
            'solde_utilise' => 0,
            'solde_restant' => $soldePrecedent + $soldeDerniere,
        ]
    );

    return $user;
}

    
    public function formatDate($value)
    {
        if (!$value) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}