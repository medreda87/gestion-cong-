<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DirectorLeaveRequestNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    public $demande;
    public $source; // 'manager_self' or 'from_manager'

    public function __construct($demande, $source = 'from_manager')
    {
        $this->demande = $demande;
        $this->source = $source;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
{
    $view = $this->source === 'manager_self'
        ? 'mail.director-leave-request-from-manager-self'
        : 'mail.director-leave-request';

    return (new MailMessage)
        ->subject('New Leave Request Awaiting Your Approval')
        ->view($view, [
            'demande' => $this->demande,
            'director' => $notifiable,
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
