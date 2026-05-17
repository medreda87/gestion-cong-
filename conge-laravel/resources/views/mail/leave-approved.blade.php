<div>
    <!-- Walk as if you are kissing the Earth with your feet. - Thich Nhat Hanh -->
    
    <h2>Demande de congé approuvée</h2>

    <p>Bonjour {{ $demande->user->nom }},</p>

    <p>
        Votre demande de congé a été approuvée par le directeur.
    </p>

    <p>
        <strong>Date début :</strong> {{ $demande->start_date }}
    </p>

    <p>
        <strong>Date fin :</strong> {{ $demande->end_date }}
    </p>

    <p>
        <strong>Statut :</strong> {{ $demande->status }}
    </p>

    <p>
        Merci.
    </p>

</div>
