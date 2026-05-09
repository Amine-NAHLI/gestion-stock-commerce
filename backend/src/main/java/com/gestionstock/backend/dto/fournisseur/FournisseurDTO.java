package com.gestionstock.backend.dto.fournisseur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO pour l'entité Fournisseur.
 * Utilisé pour le transfert de données entre le frontend et le backend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FournisseurDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
    private String pays;
    private LocalDateTime dateCreation;
}
