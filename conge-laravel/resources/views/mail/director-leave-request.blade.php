<div>
    <!-- Breathing in, I calm body and mind. Breathing out, I smile. - Thich Nhat Hanh -->
     <h2>Hello {{ $director->nom }}</h2>

    <p>
        A new leave request has been validated by the manager
        and is awaiting your approval.
    </p>

    <p>
        Employee: {{ $demande->user->nom }}
    </p>

    <p>
        Status: {{ $demande->status }}
    </p>
</div>
