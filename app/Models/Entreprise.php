<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entreprise extends Model
{
    protected $fillable = [
        "titre",
        "description",
        "date_debut",
        "date_fin",
        "type_contact"
    ];
    public function participants() : BelongsToMany
    {
        return $this->belongsToMany(Participant::class,'engager');
    }
}
