package com.gestionstock.backend.entity.produit;

import java.time.LocalDateTime;

import com.gestionstock.backend.entity.fournisseur.Fournisseur;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "produits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 50)
    private String code; // Code-barres ou référence

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(length = 1000)
    private String description;

    @Column(name = "prix_achat")
    private Double prixAchat;

    @Column(name = "prix_vente")
    private Double prixVente;

    @Column(name = "quantite_stock", nullable = false)
    private Double quantiteStock = 0.0;

    @Column(name = "seuil_alerte")
    private Double seuilAlerte = 10.0;

    @Column(length = 20)
    private String unite; // kg, litre, piece, etc.

    @Column(length = 500)
    private String image; // URL de l'image

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Relation N..1 avec Categorie
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    // Relation N..1 avec Fournisseur (fournisseur principal)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
        if (this.quantiteStock == null) this.quantiteStock = 0.0;
        if (this.seuilAlerte == null) this.seuilAlerte = 10.0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.dateModification = LocalDateTime.now();
    }

    /**
     * Vérifie si le produit est en stock bas (quantité <= seuil)
     */
    public boolean isStockBas() {
        return this.quantiteStock != null 
            && this.seuilAlerte != null 
            && this.quantiteStock <= this.seuilAlerte;
    }
}