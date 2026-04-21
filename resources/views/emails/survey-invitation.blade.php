<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $enquete->titre }}</title>
</head>

<body>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td width="600" align="center">
                <table width="600" border="0" cellpadding="0" cellspacing="0">
                    <!-- Header -->
                    <tr>
                        <td bgcolor="#ea8c55" style="color: white; padding: 30px 20px; font-family: Arial, sans-serif;">
                            <h1 style="margin: 0; font-size: 28px; color: white; font-family: Arial, sans-serif;">
                                {{ $enquete->titre }}</h1>
                            <p
                                style="margin: 10px 0 0 0; font-size: 14px; color: white; font-family: Arial, sans-serif;">
                                Votre avis nous intéresse</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td bgcolor="white"
                            style="padding: 30px 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #e0e0e0;">
                            <p style="font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">Bonjour
                                {{ $participant->prenom }} {{ $participant->nom }},</p>

                            <p style="font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">Nous vous
                                invitons à participer à notre enquête intitulée <strong>{{ $enquete->titre }}</strong>.
                            </p>

                            <p style="font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">
                                {{ $enquete->description ?? 'Votre participation nous aidera à mieux comprendre vos besoins et à améliorer nos services.' }}
                            </p>

                            <p
                                style="font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: bold;">
                                Période de réponse :<br>
                                Du {{ \Carbon\Carbon::parse($enquete->date_debut)->format('d/m/Y') }} au
                                {{ \Carbon\Carbon::parse($enquete->date_fin)->format('d/m/Y') }}
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 30px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td bgcolor="#ea8c55"
                                                    style="padding: 12px 30px; border: 1px solid #ea8c55;">
                                                    <a href="{{ $lien }}"
                                                        style="color: white; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px;">
                                                        Répondre à l'enquête
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 12px; line-height: 1.5; font-family: Arial, sans-serif; color: #999;">
                                <strong>Ou copiez ce lien :</strong><br>
                                {{ $lien }}
                            </p>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td
                                        style="border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 12px; color: #999; font-family: Arial, sans-serif;">
                                        Merci de votre participation ! Si vous avez des questions, n'hésitez pas à nous
                                        contacter.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f5"
                            style="padding: 20px; font-size: 12px; color: #999; font-family: Arial, sans-serif;">
                            &copy; {{ date('Y') }} - Tous droits réservés
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</p>
</td>
</tr>
</table>
</body>
</div>
</body>

</html>
