<div>
    <!-- Order your soul. Reduce your wants. - Augustine -->
    <h2>Nouvelle demande de congé</h2>
    <p>
    L'employé {{ $employee->nom }} {{ $employee->prenom }}
    a soumis une demande de congé.
    </p>

    <p>
    Date début : {{ $demande->start_date }}
    </p>
    <p>
    Date fin : {{ $demande->end_date }}
    </p>

    <p>
    Motif : {{ $demande->reason }}
    </p>
</div>
