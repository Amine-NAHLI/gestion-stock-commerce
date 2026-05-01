package com.gestionstock.backend.entity.fournisseur;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gestionstock.backend.entity.produit.Produit;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lignes_commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire", nullable = false)
    private Double prixUnitaire;

    @Column(name = "sous_total")
    private Double sousTotal;

    // Relation N..1 avec Commande
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonBackReference // Évite la boucle infinie en JSON
    private Commande commande;

    // Relation N..1 avec Produit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @PrePersist
    @PreUpdate
    protected void calculerSousTotal() {
        if (this.quantite != null && this.prixUnitaire != null) {
            this.sousTotal = this.quantite * this.prixUnitaire;
        }
    }
}