<?php

namespace App\Jobs;

use App\Models\Enquete;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSurveyInvitationJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public $tries = 3;
  public $backoff = [10, 60, 300];

  public function __construct(
    public int $enqueteId,
    public int $participantId,
    public string $jeton,
  ) {
    $this->onQueue('default');
    $this->delay(now()->addSeconds(rand(1, 10)));
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    try {
      // Recharger depuis la DB pour éviter les problèmes de sérialisation
      $enquete = Enquete::findOrFail($this->enqueteId);
      $participant = Participant::findOrFail($this->participantId);

      $linkRemplir = route('survey.fill.participants', ['jeton' => $this->jeton]);

      // Envoyer l'email
      Mail::send('emails.survey-invitation', [
        'participant' => $participant,
        'enquete' => $enquete,
        'lien' => $linkRemplir,
      ], function ($message) use ($participant, $enquete) {
        $message->to($participant->mail)
          ->subject("Invitation à répondre : {$enquete->titre}");
      });

      // Marquer comme envoyé dans la table pivot
      $enquete->participants()->updateExistingPivot($participant->id, [
        'statut_envoi' => 'sent',
        'canal' => 'mail',
        'date_envoi' => now(),
      ]);

      \Log::info("Mail envoyé à {$participant->mail} pour enquete {$enquete->id}");
    } catch (\Exception $e) {
      \Log::error("Erreur envoi mail participant {$this->participantId}: " . $e->getMessage(), [
        'enquete_id' => $this->enqueteId,
        'participant_id' => $this->participantId,
        'trace' => $e->getTraceAsString(),
      ]);
      throw $e;
    }
  }
}
