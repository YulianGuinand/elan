<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Psy\Output\Theme;

class Question extends Model
{
    protected $primaryKey = 'id';


    public function enquete()
    {
        return $this->belongsTo(Enquete::class)->withTimestamps();
    }

    public function type_reponse()
    {
        return $this->belongsTo(Type_Reponse::class)->withTimestamps();
    }
    public function  themes()
    {
        return $this->belongsToMany(Theme::class, 'etredefinit')->withTimestamps();
    }

    public function choix()
    {
        return $this->hasMany(Choix::class)->withTimestamps();
    }
}
