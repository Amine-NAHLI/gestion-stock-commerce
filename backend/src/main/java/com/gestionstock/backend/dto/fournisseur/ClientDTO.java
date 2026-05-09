package com.gestionstock.backend.dto.fournisseur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO pour l'entité Client.
 * Utilisé pour le transfert de données entre le frontend et le backend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private LocalDateTime dateCreation;
}
