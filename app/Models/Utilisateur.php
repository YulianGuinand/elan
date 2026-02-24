<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
  use HasFactory, Notifiable;

  /**
   * Le nom de la table associée au modèle.
   *
   * @var string
   */
  protected $table = 'utilisateurs';

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'nom',
    'prenom',
    'fonction',
    'email',
    'mdp',
    'role',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'mdp',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'mdp' => 'hashed',
    ];
  }

  /**
   * Get the password for authentication.
   *
   * @return string
   */
  public function getAuthPassword()
  {
    return $this->mdp;
  }

  /**
   * Accesseur pour role enum.
   * Valeurs possibles: 'admin', 'superadmin', 'utilisateur'
   */
  public function isAdmin(): bool
  {
    return $this->role === 'admin' || $this->role === 'superadmin';
  }

  public function isSuperAdmin(): bool
  {
    return $this->role === 'superadmin';
  }

  /**
   * Accesseur pour obtenir le nom complet (nom + prenom).
   * Utilisé pour la compatibilité avec le frontend.
   *
   * @return string
   */
  public function getNameAttribute(): string
  {
    return trim("{$this->prenom} {$this->nom}");
  }

  /**
   * Relation : Un utilisateur peut créer plusieurs enquêtes.
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function enquetes()
  {
    return $this->hasMany(Enquete::class, 'utilisateur_id');
  }

  public function participants()
  {
      return $this->belongsToMany(Participant::class, 'contacter')
          ->withPivot('utilisateur_id','date_contact','moyen','commentaire')
          ->withTimestamps();
  }
}
