<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type_Reponse extends Model
{
    protected $table = 'type_reponses';

    protected $fillable = [
        'libelle'
    ];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
