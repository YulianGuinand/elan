<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email_notifications',
        'survey_reminders',
        'response_alerts',
        'weekly_reports',
        'system_updates',
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'survey_reminders' => 'boolean',
        'response_alerts' => 'boolean',
        'weekly_reports' => 'boolean',
        'system_updates' => 'boolean',
    ];

    /**
     * Relation : les préférences appartiennent à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'user_id');
    }
}
