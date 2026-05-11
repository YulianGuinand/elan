<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Type_Reponse extends Model
{
    use HasFactory;
    protected $table = 'type__reponses';

    protected $fillable = [
        'libelle'
    ];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
