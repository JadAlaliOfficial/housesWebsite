<?php

namespace App\Mail;

use App\Models\Stage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StageEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $stage;
    public $logoCid; // Added for logo embedding

    public function __construct(User $user, Stage $stage)
    {
        $this->user = $user;
        $this->stage = $stage;
    }

    public function build()
    {
        // Embed logo
        $pngData = file_get_contents(public_path('images/logo.png'));
        $this->logoCid = $this->embedData($pngData, 'logo.png', 'image/png');

        return $this->subject($this->stage->email_subject)
                    ->view('emails.stage_email')
                    ->with([
                        'user' => $this->user,
                        'stage' => $this->stage,
                        'content' => $this->stage->email_content,
                        'logoCid' => $this->logoCid // Pass to view
                    ]);
    }

    protected function embedData($data, $name, $contentType)
    {
        $this->attachData($data, $name, [
            'mime' => $contentType,
        ]);
        
        return 'cid:' . $name;
    }
}