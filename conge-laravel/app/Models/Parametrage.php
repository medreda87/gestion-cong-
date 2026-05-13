<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametrage extends Model
{
    protected $table = 'parametrage';

    protected $fillable = [
        'user_id',
        'ref_document',
        'num_decision',
        'date_decision',
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}