<?php

namespace App\Models;

use COM;
use Illuminate\Database\Eloquent\Model;

class promotion extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'libelle',
        'date_entree',
        'date_sortie'
    ];

    public function contratsBelong()
    {
        return $this->hasMany(
            Contrat::class,
            'contrats',
            'id'
        )->withTimestamps();
    }
}
