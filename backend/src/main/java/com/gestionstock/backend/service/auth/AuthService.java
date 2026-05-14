package com.gestionstock.backend.service.auth;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionstock.backend.dto.auth.JwtResponse;
import com.gestionstock.backend.dto.auth.LoginRequest;
import com.gestionstock.backend.dto.auth.MessageResponse;
import com.gestionstock.backend.dto.auth.RegisterRequest;
import com.gestionstock.backend.entity.auth.Role;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.auth.VerificationToken;
import com.gestionstock.backend.repository.auth.RoleRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import com.gestionstock.backend.security.JwtService;
import com.gestionstock.backend.service.email.EmailService;

import lombok.RequiredArgsConstructor;

/**
 * Service de gestion de l'authentification - Login (connexion) - Register
 * (inscription)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final VerificationTokenService verificationTokenService;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    /**
     * Authentifie un utilisateur et génère un token JWT
     */
    public JwtResponse login(LoginRequest request) {
        // 1. Authentifier l'utilisateur via Spring Security
        //    Cela appelle UserDetailsServiceImpl.loadUserByUsername()
        //    et vérifie le mot de passe avec BCrypt
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // 2. Récupérer l'utilisateur depuis la BDD
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3. Créer un UserDetails pour générer le token
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().getNom())
                .build();

        // 4. Générer le token JWT
        String token = jwtService.generateToken(userDetails);

        // 5. Retourner la réponse avec le token et les infos utilisateur
        return new JwtResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNomComplet(),
                user.getRole().getNom());
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        // 1. Vérifier que le username n'existe pas déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            return new MessageResponse("Ce nom d'utilisateur est déjà pris", false);
        }

        // 2. Vérifier que l'email n'existe pas déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return new MessageResponse("Cet email est déjà utilisé", false);
        }

        // 3. Récupérer le rôle (par défaut EMPLOYE)
        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase()
                : "EMPLOYE";

        Role role = roleRepository.findByNom(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle introuvable : " + roleName));

        // 4. Créer le nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ⚠️ BCrypt
        user.setNomComplet(request.getNomComplet());
        user.setRole(role);
        user.setActif(false); // 🔒 Inactif par défaut
        user.setEnAttenteApprobation(true); // ⏳ En attente
        user.setDateCreation(LocalDateTime.now());

        // 5. Sauvegarder en BDD
        userRepository.save(user);

        VerificationToken verificationToken = verificationTokenService.createToken(user);
        sendVerificationEmail(user, verificationToken);

        return new MessageResponse("Inscription réussie. Un email de confirmation a été envoyé à " + user.getEmail() + ".", true);
    }

    private void sendVerificationEmail(User user, VerificationToken token) {
        String verificationUrl = String.format("%s/api/auth/verify-email?token=%s", backendUrl, token.getToken());
        String subject = "Confirmez votre adresse email STOCKLY";
        String htmlBody = buildVerificationEmailBody(user.getUsername(), verificationUrl);
        emailService.sendEmail(user.getEmail(), subject, htmlBody);
    }

    private String buildVerificationEmailBody(String username, String verificationUrl) {
        return "<div style=\"font-family:Arial,sans-serif;color:#333;line-height:1.5;\">"
                + "<h2>Bonjour " + username + ",</h2>"
                + "<p>Merci de vous être inscrit sur STOCKLY. Cliquez sur le bouton ci-dessous pour activer votre compte :</p>"
                + "<p><a href=\"" + verificationUrl + "\" style=\"display:inline-block;padding:12px 20px;background-color:#3b82f6;color:#ffffff;text-decoration:none;border-radius:8px;\">Vérifier mon adresse email</a></p>"
                + "<p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>"
                + "<p><a href=\"" + verificationUrl + "\">" + verificationUrl + "</a></p>"
                + "<p>Ce lien expirera dans 24 heures.</p>"
                + "<p>À bientôt,<br/>L'équipe STOCKLY</p>"
                + "</div>";
    }

    @Transactional
    public MessageResponse verifyEmailToken(String token) {
        Optional<VerificationToken> optionalToken = verificationTokenService.findByToken(token);

        if (optionalToken.isEmpty()) {
            return new MessageResponse("Token de vérification invalide.", false);
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            verificationTokenService.invalidateToken(verificationToken);
            return new MessageResponse("Le lien de vérification a expiré.", false);
        }

        User user = verificationToken.getUser();
        user.setActif(true); // enabled = true
        user.setEnAttenteApprobation(false);
        userRepository.save(user);

        verificationTokenService.invalidateToken(verificationToken);

        return new MessageResponse("Adresse email vérifiée avec succès. Votre compte est maintenant activé.", true);
    }
}
