<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Choix extends Model
{
    protected $fillable = ['libelle', 'question_id'];

    public function Question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
