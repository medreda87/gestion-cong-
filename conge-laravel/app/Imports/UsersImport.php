<?php

namespace App\Imports;

use App\Models\User;
use App\Models\DetailUser;
use App\Models\DetailJobUser;
use App\Models\SoldeConge;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Carbon\Carbon;

class UsersImport implements ToModel, WithHeadingRow, WithChunkReading
{
    public function model(array $row)
    {
        if (empty($row['email'])) {
            return null;
        }

        $email = trim($row['email']);

        // ================= USER =================
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'matricule' => $row['matricule'] ?? null,
                'nom' => $row['nom'] ?? null,
                'prenom' => $row['prenom'] ?? null,
                'nom_prenom' => $row['nom_prenom'] ?? null,
                'nom_ar' => $row['nom_ar'] ?? null,
                'prenom_ar' => $row['prenom_ar'] ?? null,
                'actif' => $row['actif'] ?? 1,
                'affectation' => $row['affectation'] ?? null,
                'efp_travail' => $row['efp_travail'] ?? null,
                'password' => Hash::make($row['password'] ?? 'password'),
                'observation' => $row['observation'] ?? null,
                'role' => $row['role'] ?? 'employee',
                'solde_annee_precedente' => (int) ($row['solde_annee_precedente'] ?? 0),
                'solde_annee_derniere' => (int) ($row['solde_annee_derniere'] ?? 0),
            ]
        );

        // ================= DETAIL USER =================
        DetailUser::updateOrCreate(
            ['user_id' => $user->id],
            [
                'sexe' => $row['sexe'] ?? null,
                'cin' => $row['cin'] ?? null,
                'date_naissance' => $this->formatDate($row['date_naissance'] ?? null),
                'adresse' => $row['adresse'] ?? null,
                'ville' => $row['ville'] ?? null,
                'telephone' => $row['telephone'] ?? null,
                'photo' => $row['photo'] ?? null,
            ]
        );

        // ================= JOB =================
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
                'date_recrutement' => $this->formatDate($row['date_recrutement'] ?? null),
                'date_prise_service' => $this->formatDate($row['date_prise_service'] ?? null),
                'recode_annee_ant' => $row['recode_annee_ant'] ?? null,
            ]
        );

        // ================= SOLDE =================
        $pre = (float) ($row['solde_annee_precedente'] ?? 0);
        $dern = (float) ($row['solde_annee_derniere'] ?? 0);
        $total = $pre + $dern;

        SoldeConge::updateOrCreate(
            ['user_id' => $user->id],
            [
                'solde_annee_precedente' => $pre,
                'total_annuel' => $total,
                'solde_utilise' => 0,
                'solde_restant' => $total,
            ]
        );

        return $user;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    private function formatDate($value)
    {
        if (!$value) return null;

        try {
            // Excel غالباً d/m/Y
            return Carbon::createFromFormat('d/m/Y', trim($value))->format('Y-m-d');
        } catch (\Exception $e) {
            try {
                return Carbon::parse($value)->format('Y-m-d');
            } catch (\Exception $e2) {
                return null;
            }
        }
    }
}