<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participant extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'mail',
        'role'
    ];

    public function entreprises(): BelongsToMany
    {
        return $this->belongsToMany(Entreprise::class, 'engager');
    }

    public function enquetes(): BelongsToMany
    {
        return $this->belongsToMany(Enquete::class, 'participer')
            ->withPivot('jeton')
            ->withTimestamps();
    }


    public function contrats(): HasMany
    {
        return $this->HasMany(Contrat::class);
    }

    public function utilisateurs(): BelongsToMany
    {
        return $this->belongsToMany(Utilisateur::class, 'contacter')
            ->withPivot('enquete_id', 'date_contact', 'moyen', 'commentaire')
            ->withTimestamps();
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'repondre')
            ->withPivot('valeur')
            ->withTimestamps();
    }
}
