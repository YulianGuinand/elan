<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    protected $primaryKey = 'id';

    public function participantsbelongs()
    {
        return $this->hasOne(Participant::class, 'id', 'id');
    }

    public function questionbelongs()
    {
        return $this->hasOne(
            Question::class,
            'id',
            'id'
        );
    }
}
