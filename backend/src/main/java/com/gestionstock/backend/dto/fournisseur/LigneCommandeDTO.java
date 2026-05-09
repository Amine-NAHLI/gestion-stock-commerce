package com.gestionstock.backend.dto.fournisseur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour l'entité LigneCommande.
 * Représente une ligne de produit dans une commande fournisseur.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LigneCommandeDTO {
    private Long id;
    private Long produitId;
    private String produitNom;
    private String produitCode;
    private Integer quantite;
    private Double prixUnitaire;
    private Double sousTotal;
}
