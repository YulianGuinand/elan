<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entreprise extends Model
{
    protected $fillable = [
        "raison_sociale",
        "mail",
        "telephone",
        "ville",
        "interlocuteur"
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'engager');
    }

    public function contrats(): HasMany
    {
        return $this->hasMany(Contrat::class, 'entreprise_id');
    }
}
