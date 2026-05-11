<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'libelle',
        'numero',
        'enquete_id',
        'type_reponse_id',
        'theme_id',
        'likert_style'
    ];

    public function enquete()
    {
        return $this->belongsTo(Enquete::class);
    }

    public function type_reponse()
    {
        return $this->belongsTo(Type_Reponse::class);
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function choix()
    {
        return $this->hasMany(Choix::class);
    }

    public function participants(){
        return $this->belongsToMany(Participant::class,'repondre')
            ->withPivot('valeur')
            ->withTimestamps();
    }
}
