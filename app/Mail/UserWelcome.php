<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserWelcome extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $logoCid; // Added for logo embedding

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        $pngData = file_get_contents(public_path('images/logo.png'));
        $this->logoCid = $this->embedData($pngData, 'logo.png', 'image/png');

        return $this->subject('Welcome to PNE Homes')
                    ->view('emails.user_welcome')
                    ->with([
                        'user' => $this->user,
                        'logoCid' => $this->logoCid
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