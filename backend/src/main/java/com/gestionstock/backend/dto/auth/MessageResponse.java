package com.gestionstock.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO générique pour les messages de réponse
 * Utilisé pour confirmer une action ou retourner une erreur
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private String message;
    private Boolean success;

    /**
     * Constructeur pour message simple (success = true par défaut)
     */
    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }
}