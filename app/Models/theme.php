<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;


use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $table = 'themes';

    protected $fillable = [
        'libelle',
        'ordre'
    ];
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('numero');
    }
}
