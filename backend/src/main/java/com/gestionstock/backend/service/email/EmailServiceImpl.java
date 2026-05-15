package com.gestionstock.backend.service.email;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implémentation simple du service d'e-mail utilisant JavaMailSender.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${spring.mail.from:${spring.mail.username:}}")
    private String fromAddress;

    @Override
    public void sendEmail(String to, String subject, String htmlBody) {
        log.debug("Envoi de l'email de vérification à {}", to);

        if (!mailEnabled || fromAddress == null || fromAddress.isBlank()) {
            log.warn("Envoi d'email désactivé car la configuration SMTP est incomplète. Email prévu vers {} non envoyé. Sujet='{}'", to, subject);
            log.debug("Contenu email: {}", htmlBody);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email de vérification envoyé à {}", to);
        } catch (MessagingException ex) {
            log.error("Échec de l'envoi de l'email à {} : {}", to, ex.getMessage(), ex);
            throw new RuntimeException("Impossible d'envoyer l'e-mail de vérification", ex);
        }
    }
}
