<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Formations extends Model
{
    protected $fillable = [
        "libelle"
    ];
    public function contrats() : HasMany
    {
        return $this->hasMany(Contrat::class);
    }
    public function ecoles() : BelongsToMany
    {
        return $this->belongsToMany(Ecole::class);
    }
}
