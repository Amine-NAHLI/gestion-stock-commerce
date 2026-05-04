package com.gestionstock.backend.dto.produit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProduitDTO {
    private Long id;
    private String code;
    private String nom;
    private String description;
    private Double prixAchat;
    private Double prixVente;
    private Double quantiteStock;
    private Double seuilAlerte;
    private String unite;
    private String image;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private Long categorieId;
    private String categorieNom;
    private Long fournisseurId;
    private String fournisseurNom;
}
