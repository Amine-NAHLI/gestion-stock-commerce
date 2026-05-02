package com.gestionstock.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de réponse après une authentification réussie
 * Envoyé au frontend Angular
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String type = "Bearer"; // Type de token (standard JWT)
    private Long id;
    private String username;
    private String email;
    private String nomComplet;
    private String role;

    /**
     * Constructeur principal
     */
    public JwtResponse(String token, Long id, String username, String email, String nomComplet, String role) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.nomComplet = nomComplet;
        this.role = role;
    }
}