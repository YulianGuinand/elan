<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeReponse extends Model
{
    protected $table = 'type_reponses';

    protected $fillable = [
        'libelle'
    ];

    public function questions()
    {
        return $this->hasMany(Question::class, 'question_id');
    }
}
