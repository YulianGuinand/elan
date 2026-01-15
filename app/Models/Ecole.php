<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ecole extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'ecoles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
        'adresse',
        'code_postal',
        'ville',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relation : Une école peut avoir plusieurs contrats.
     *
     * @return HasMany
     */
    public function contrats(): HasMany
    {
        return $this->hasMany(Contrat::class);
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Contrat::class,'etreenseigner');
    }
    /**
     * Accesseur pour l'adresse complète.
     *
     * @return string
     */
    public function getAdresseCompleteAttribute(): string
    {
        return "{$this->adresse}, {$this->code_postal} {$this->ville}";
    }
}
