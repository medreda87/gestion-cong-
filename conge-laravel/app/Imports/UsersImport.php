<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new User([
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
            'fonction' => $row['fonction'] ?? null,
            'nature_fonction' => $row['nature_fonction'] ?? null,

            'echelle' => $row['echelle'] ?? null,
            'categorie' => $row['categorie'] ?? null,
            'grade' => $row['grade'] ?? null,

            'cin' => $row['cin'] ?? null,
            'date_naissance' => $this->formatDate($row['date_naissance'] ?? null),

            'adresse' => $row['adresse'] ?? null,
            'ville' => $row['ville'] ?? null,
            'telephone' => $row['telephone'] ?? null,

            'email' => $row['email'] ?? null,
            'password' => Hash::make('12345678'),

            'diplome' => $row['diplome'] ?? null,
            'specialite' => $row['specialite'] ?? null,

            'date_recrutement' => $this->formatDate($row['date_recrutement'] ?? null),
            'date_prise_service' => $this->formatDate($row['date_prise_service'] ?? null),

            'recode_annee_ant' => $row['recode_annee_ant'] ?? null,
            'observation' => $row['observation'] ?? null,
            'photo' => $row['photo'] ?? null,

            'role' => $row['role'] ?? 'employee',

            'solde_annee_derniere' => $row['solde_annee_derniere'] ?? 0,
            'solde_annee_precedente' => $row['solde_annee_precedente'] ?? 0,
        ]);
    }

    private function formatDate($value)
    {
        if (!$value) return null;

        try {
            return \Carbon\Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}