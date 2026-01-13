<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class promotion extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'libelle',
        'date_entree',
        'date_sortie'
    ];
}
