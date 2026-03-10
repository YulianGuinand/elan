<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'libelle',
        'numero',
        'enquete_id',
        'type_reponse_id',
        'theme_id'
    ];

    public function enquete()
    {
        return $this->belongsTo(Enquete::class);
    }

    public function type_reponse()
    {
        return $this->belongsTo(Type_Reponse::class);
    }

    public function themes()
    {
        return $this->belongsTo(Enquete::class);
    }

    public function choix()
    {
        return $this->hasMany(Choix::class);
    }
}
