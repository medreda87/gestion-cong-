<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmployeeCancelledNotification extends Notification
{
    use Queueable;

    public $demande;

    public function __construct($demande)
    {
        $this->demande = $demande;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Demande de congé annulée par un employé')
            ->view('mail.employee-cancelled', [
                'demande' => $this->demande,
                'manager' => $notifiable,
            ]);
    }
}