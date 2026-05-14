package com.gestionstock.backend.service.email;

/**
 * Service d'envoi d'e-mails.
 */
public interface EmailService {

    /**
     * Envoie un email HTML.
     *
     * @param to destinataire
     * @param subject sujet de l'email
     * @param htmlBody contenu HTML
     */
    void sendEmail(String to, String subject, String htmlBody);
}
