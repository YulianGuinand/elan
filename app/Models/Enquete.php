<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property string $titre
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $date_debut
 * @property \Illuminate\Support\Carbon|null $date_fin
 * @property string $type_campagne
 * @property int $utilisateur_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Enquete extends Model
{
    use HasFactory;

    protected $table = 'enquetes';

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'type_campagne',
        'utilisateur_id',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('numero');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'participer')
            ->withPivot('jeton', 'statut_envoi', 'date_envoi', 'canal')
            ->withTimestamps();
    }

    public function contacts()
    {
        return $this->belongsToMany(Participant::class, 'contacter')
            ->withPivot('utilisateur_id', 'date_contact', 'moyen', 'commentaire')
            ->withTimestamps();
    }

    public function isActive(): bool
    {
        $now = now()->toDateString();

        return $this->date_debut?->toDateString() <= $now
            && $this->date_fin?->toDateString() >= $now;
    }

    public function isTerminee(): bool
    {
        return $this->date_fin?->toDateString() < now()->toDateString();
    }

    public function isAVenir(): bool
    {
        return $this->date_debut?->toDateString() > now()->toDateString();
    }

    public function getStatutAttribute(): string
    {
        if ($this->isTerminee()) {
            return 'terminee';
        }
        if ($this->isActive()) {
            return 'active';
        }
        if ($this->isAVenir()) {
            return 'a_venir';
        }

        return 'brouillon';
    }
}
