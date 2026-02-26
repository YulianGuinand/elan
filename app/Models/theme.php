<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Theme extends Model
{
    protected $table = 'themes';

    protected $fillable = [
        'libelle'
    ];
    public function questions()
    {
        return $this->BelongsToMAny(Question::class, 'etredefinit');
    }
}
