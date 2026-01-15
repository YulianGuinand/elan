<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    protected $primaryKey = 'id';

    public function participant()
    {
        return $this->belongsto(Participant::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
