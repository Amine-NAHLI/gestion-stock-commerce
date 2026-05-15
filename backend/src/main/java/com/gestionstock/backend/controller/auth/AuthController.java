package com.gestionstock.backend.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionstock.backend.dto.auth.JwtResponse;
import com.gestionstock.backend.dto.auth.LoginRequest;
import com.gestionstock.backend.dto.auth.MessageResponse;
import com.gestionstock.backend.dto.auth.RegisterRequest;
import com.gestionstock.backend.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller REST pour l'authentification Endpoints : - POST /api/auth/login -
 * POST /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.gestionstock.backend.repository.auth.UserRepository userRepository;
    private final com.gestionstock.backend.security.JwtService jwtService;

    /**
     * Connexion d'un utilisateur
     *
     * @param request LoginRequest contenant username + password
     * @return JwtResponse avec le token JWT et les infos utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Nom d'utilisateur ou mot de passe incorrect", false));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (DisabledException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de la connexion : " + e.getMessage(), false));
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     *
     * @param request RegisterRequest contenant les infos du nouvel utilisateur
     * @return MessageResponse avec succès ou erreur
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            MessageResponse response = authService.register(request);
            if (response.getSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de l'inscription : " + e.getMessage(), false));
        }
    }

    @GetMapping(value = "/verify-email", produces = "text/html")
    public String verifyEmail(@RequestParam("token") String token) {
        try {
            MessageResponse response = authService.verifyEmailToken(token);
            if (response.getSuccess()) {
                return buildStatusHtml("Succès !", response.getMessage(), "#10b981", "check-circle");
            }
            return buildStatusHtml("Oups !", response.getMessage(), "#ef4444", "x-circle");
        } catch (Exception e) {
            return buildStatusHtml("Erreur", "Une erreur technique est survenue : " + e.getMessage(), "#f59e0b", "alert-triangle");
        }
    }

    private String buildStatusHtml(String title, String message, String color, String icon) {
        return "<!DOCTYPE html>"
                + "<html lang=\"fr\">"
                + "<head>"
                + "    <meta charset=\"UTF-8\">"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "    <title>" + title + " | STOCKLY</title>"
                + "    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap\" rel=\"stylesheet\">"
                + "    <style>"
                + "        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
                + "        .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; max-width: 450px; width: 90%; border-top: 6px solid " + color + "; }"
                + "        .icon { font-size: 4rem; color: " + color + "; margin-bottom: 1.5rem; }"
                + "        h1 { color: #1e293b; margin-bottom: 1rem; font-weight: 700; }"
                + "        p { color: #64748b; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem; }"
                + "        .btn { background-color: #3b82f6; color: white; padding: 0.8rem 2rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s; display: inline-block; }"
                + "        .btn:hover { background-color: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }"
                + "    </style>"
                + "</head>"
                + "<body>"
                + "    <div class=\"card\">"
                + "        <div class=\"icon\">" + (color.equals("#10b981") ? "✓" : "⚠") + "</div>"
                + "        <h1>" + title + "</h1>"
                + "        <p>" + message + "</p>"
                + "        <a href=\"http://localhost:4200/login\" class=\"btn\">Retourner à la connexion</a>"
                + "    </div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Endpoint public (démo) pour récupérer tous les utilisateurs afin de
     * faciliter le login lors de la présentation
     *
     * @return Liste de tous les utilisateurs (sans mot de passe)
     */
    @org.springframework.web.bind.annotation.GetMapping("/demo-users")
    public ResponseEntity<?> getDemoUsers() {
        // On récupère uniquement les utilisateurs actifs, vérifiés et approuvés
        java.util.List<com.gestionstock.backend.entity.auth.User> users = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getActif()))
                .filter(u -> Boolean.TRUE.equals(u.getEmailVerifie()))
                .filter(u -> !Boolean.TRUE.equals(u.getEnAttenteApprobation()))
                .collect(java.util.stream.Collectors.toList());

        java.util.List<java.util.Map<String, String>> demoUsers = new java.util.ArrayList<>();
        for (com.gestionstock.backend.entity.auth.User u : users) {
            java.util.Map<String, String> userMap = new java.util.HashMap<>();
            userMap.put("username", u.getUsername());
            userMap.put("nomComplet", u.getNomComplet());
            userMap.put("role", u.getRole().getNom());
            demoUsers.add(userMap);
        }
        return ResponseEntity.ok(demoUsers);
    }

    /**
     * Endpoint de connexion SANS MOT DE PASSE pour la présentation
     */
    @PostMapping("/demo-login")
    public ResponseEntity<?> demoLogin(@RequestBody java.util.Map<String, String> request) {
        try {
            String username = request.get("username");
            com.gestionstock.backend.entity.auth.User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            if (!Boolean.TRUE.equals(user.getEmailVerifie())) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Veuillez verifier votre adresse email avant de vous connecter.", false));
            }

            if (!Boolean.TRUE.equals(user.getActif()) || Boolean.TRUE.equals(user.getEnAttenteApprobation())) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Votre compte est en attente d approbation par l administrateur.", false));
            }

            org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole().getNom())
                    .build();

            // Générer le token JWT via le JwtService bean sans vérifier le mot de passe
            String token = jwtService.generateToken(userDetails);

            JwtResponse response = new JwtResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getNomComplet(),
                    user.getRole().getNom());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur : " + e.getMessage(), false));
        }
    }
}
