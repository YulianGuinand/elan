<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reponse extends Model
{
    use HasFactory;

    protected $table = 'repondre';

    protected $fillable = [
        'question_id',
        'participant_id',
        'valeur',
    ];

    /**
     * Une réponse appartient à une question
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Une réponse appartient à un participant
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
