<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailUser extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'sexe',
        'cin',
        'date_naissance',
        'adresse',
        'ville',
        'telephone',
        'photo',
    ];
}
