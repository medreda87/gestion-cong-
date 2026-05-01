<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = [
            'user_id',
            'type',
            'sub_type',
            'start_date',
            'end_date',
            'duration',
            'reason',
            'interimaire_id',
            'status',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
