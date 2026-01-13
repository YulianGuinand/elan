<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class participant extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'mail'
    ];
}
