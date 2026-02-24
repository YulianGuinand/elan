<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participant extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'mail'
    ];

    public function entreprises() : BelongsToMany
    {
        return $this->belongsToMany(Entreprise::class,'engager');
    }

    public function enquetes() : BelongsToMany
    {
        return $this->belongsToMany(Enquete::class,'participer');
    }

    public function contrats() : HasMany
    {
        return $this->HasMany(Contrat::class);
    }

    public function reponses() : HasMany
    {
        return $this->hasMany(Reponse::class);
    }

    public function utilisateurs() : BelongsToMany
    {
        return $this->belongsToMany(Utilisateur::class, 'contacter')
            ->withPivot('enquete_id','date_contact','moyen','commentaire')
            ->withTimestamps();
    }
}
