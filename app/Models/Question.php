<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Psy\Output\Theme;

class Question extends Model
{
    protected $primaryKey = 'id';


    public function enquetebelongs()
    {
        return $this->hasOne(Enquete::class, 'enquetes', 'id')->withTimestamps();
    }

    public function reponsesbelongs()
    {
        return $this->hasMany(Reponse::class, 'reponses', 'id')->withTimestamps();
    }
    public function type_reponsebelongs()
    {
        return $this->hasOne(
            Type_Reponse::class,
            'type__reponses',
            'id'
        )->withTimestamps();
    }
    public function  themebelongs()
    {
        return $this->hasMany(Theme::class, 'themes', 'id')->withTimestamps();
    }
}
