<div>
    <!-- Waste no more time arguing what a good man should be, be one. - Marcus Aurelius -->
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Demande approuvée</title>
    </head>
    <body style="font-family: Arial; background:#f4f4f4; padding:20px;">

        <div style="background:white; padding:30px; border-radius:10px;">

            <h2>Bonjour {{ $demande->user->nom }}</h2>

            <p>
                Votre demande de congé a été
                <strong>{{ $demande->status }}</strong>.
            </p>

            <p>
                ID Demande : {{ $demande->id }}
            </p>

            <p>
                Date début : {{ $demande->start_date }}
            </p>

            <p>
                Date fin : {{ $demande->end_date }}
            </p>
            <br>

            <p>Merci pour votre confiance.</p>

        </div>

    </body>
    </html>
</div>
