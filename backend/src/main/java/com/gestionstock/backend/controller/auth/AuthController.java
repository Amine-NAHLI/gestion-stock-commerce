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

    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam("token") String token) {
        try {
            MessageResponse response = authService.verifyEmailToken(token);
            if (response.getSuccess()) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de la vérification de l'email : " + e.getMessage(), false));
        }
    }

    /**
     * Endpoint public (démo) pour récupérer tous les utilisateurs afin de
     * faciliter le login lors de la présentation
     *
     * @return Liste de tous les utilisateurs (sans mot de passe)
     */
    @org.springframework.web.bind.annotation.GetMapping("/demo-users")
    public ResponseEntity<?> getDemoUsers() {
        // En vrai, il faudrait passer par le service, mais pour ce endpoint de démo, on utilise le repo directement
        java.util.List<com.gestionstock.backend.entity.auth.User> users = userRepository.findAll();

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

            if (!user.getActif()) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Votre compte est désactivé. Veuillez contacter l'administrateur.", false));
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
