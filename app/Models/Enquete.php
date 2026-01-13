<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquete extends Model
{
    protected $table = 'enquetes';

    protected $fillable = [
        'titre',
        'description'
    ];

    public function utilisateur()
    {
        return $this->hasOne(User::class, 'utilisateur_id');
    }

    public function participants()
    {
        return $this->hasMany(participant::class, 'participant_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'question_id');
    }

    
    /**
     * Vérifie si l'enquête est active (date actuelle entre date_debut et date_fin).
     *
     * @return bool
     */
    public function isActive(): bool
    {
        $now = now()->toDateString();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }

    /**
     * Vérifie si l'enquête est terminée.
     *
     * @return bool
     */
    public function isTerminee(): bool
    {
        return $this->date_fin < now()->toDateString();
    }

    /**
     * Vérifie si l'enquête est à venir.
     *
     * @return bool
     */
    public function isAVenir(): bool
    {
        return $this->date_debut > now()->toDateString();
    }
 
}
