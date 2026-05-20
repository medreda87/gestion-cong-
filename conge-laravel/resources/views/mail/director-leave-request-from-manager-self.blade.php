<div>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1d4ed8;">Bonjour {{ $director->nom }},</h2>

        <p>Un <strong>responsable</strong> a soumis une demande de congé qui nécessite votre approbation.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Responsable</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $demande->user->nom }} {{ $demande->user->prenom }}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Type de congé</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $demande->type }}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Date de début</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $demande->start_date }}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Date de fin</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $demande->end_date }}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Durée</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $demande->duration }} jour(s)</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Statut</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; color: #d97706;">En attente de votre approbation</td>
            </tr>
        </table>

        <p style="margin-top: 20px; color: #6b7280; font-size: 13px;">
            Veuillez vous connecter au système pour approuver ou rejeter cette demande.
        </p>
    </div>
</div>