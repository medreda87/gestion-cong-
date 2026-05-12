<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoldeConge extends Model
{
    use HasFactory;

    protected $table = 'solde_conges';

    protected $fillable = [
    'user_id',
    'solde_annee_precedente',
    'total_annuel',
    'solde_utilise',
    'solde_restant',
    
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
