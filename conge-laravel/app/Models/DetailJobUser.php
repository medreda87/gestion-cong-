<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailJobUser extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'fonction',
        'nature_fonction',
        'echelle',
        'categorie',
        'grade',
        'diplome',
        'specialite',
        'date_recrutement',
        'date_prise_service',
        'recode_annee_ant',
    ];
}
