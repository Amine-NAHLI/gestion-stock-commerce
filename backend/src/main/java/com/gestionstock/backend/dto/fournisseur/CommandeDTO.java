package com.gestionstock.backend.dto.fournisseur;

import com.gestionstock.backend.entity.enums.StatutCommande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO pour l'entité Commande.
 * Contient toutes les informations d'une commande, y compris ses lignes.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommandeDTO {
    private Long id;
    private String numero;
    private LocalDateTime dateCommande;
    private LocalDateTime dateLivraison;
    private StatutCommande statut;
    private Double montantTotal;
    private Long fournisseurId;
    private String fournisseurNom;
    private Long userId;
    private String userNom;
    private List<LigneCommandeDTO> lignes;
}
