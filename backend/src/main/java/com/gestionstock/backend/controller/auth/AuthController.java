package com.gestionstock.backend.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionstock.backend.dto.auth.JwtResponse;
import com.gestionstock.backend.dto.auth.LoginRequest;
import com.gestionstock.backend.dto.auth.MessageResponse;
import com.gestionstock.backend.dto.auth.RegisterRequest;
import com.gestionstock.backend.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller REST pour l'authentification
 * Endpoints : 
 * - POST /api/auth/login
 * - POST /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}