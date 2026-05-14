<?php

namespace App\Models;

use App\Models\SoldeConge;
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
        'email',
        'password',
        'actif',
        'affectation',
        'efp_travail',
        'observation',
        'role',
        'solde_annee_precedente',   
        'solde_annee_derniere',
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
        return $this->hasOne(SoldeConge::class);
    }

    public function soldeConge()
    {
        return $this->hasOne(SoldeConge::class);
    }

    public function Demande(){
        return $this->hasMany(Demande::class);
    }
    public function detailUser()
    {
        return $this->hasOne(DetailUser::class);
    }

    public function detailJobUser()
    {
        return $this->hasOne(DetailJobUser::class);
    }
    public function parametrages()
    {
        return $this->hasMany(Parametrage::class);
    }
}
