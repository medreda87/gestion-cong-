<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LeaveStatusChangedNotification extends Notification
{
    use Queueable;

    public $leave;
    public $status;

    public function __construct($leave, $status)
    {
        $this->leave = $leave;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        /*
        |-----------------------------------
        | Manager a validé (send info)
        |-----------------------------------
        */
        if ($this->status === 'pending_director') {

            return (new MailMessage)
                ->subject('Demande validée par le manager')
                ->view('mail.leave-status', [
                    'demande' => $this->leave,
                ]);
        }

        /*
        |-----------------------------------
        | Directeur a approuvé définitivement
        |-----------------------------------
        */
        if ($this->status === 'approved') {

            return (new MailMessage)
                ->subject('Demande de congé approuvée')
                ->view('mail.leave-approved', [
                    'demande' => $this->leave,
                ]);
        }

        /*
        |-----------------------------------
        | fallback (important)
        |-----------------------------------
        */
        return (new MailMessage)
            ->subject('Mise à jour demande congé')
            ->view('mail.leave-status', [
                'demande' => $this->leave,
            ]);
    }
}