<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
protected $fillable = [
    'matricule',
    'nom',
    'prenom',
    'nom_prenom',
    'nom_ar',
    'prenom_ar',
    'genre',
    'actif',
    'affectation',
    'efp_travail',
    'fonction',
    'nature_fonction',
    'echelle',
    'categorie',
    'grade',
    'cin',
    'date_naissance',
    'adresse',
    'ville',
    'telephone',
    'email',
    'password',
    'diplome',
    'specialite',
    'date_recrutement',
    'date_prise_service',
    'recode_annee_ant',
    'observation',
    'photo',
    'role',
    'solde_annee_derniere',
    'solde_annee_precedente',
];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
       public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function soldeConges()
    {
        return $this->hasMany(SoldeConge::class);
    }
    public function Demande(){
        $this->hasMany(Demande::class);
    }
}
