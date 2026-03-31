<?php

namespace App\Events;

use App\Models\Enquete;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ResponseReceived
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Enquete $enquete,
        public int $responseCount = 1
    )
    {
    }
}
