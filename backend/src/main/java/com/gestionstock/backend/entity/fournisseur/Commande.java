package com.gestionstock.backend.entity.fournisseur;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.enums.StatutCommande;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "commandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String numero; // Ex: CMD-2026-001

    @Column(name = "date_commande", nullable = false, updatable = false)
    private LocalDateTime dateCommande;

    @Column(name = "date_livraison")
    private LocalDateTime dateLivraison;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutCommande statut = StatutCommande.EN_ATTENTE;

    @Column(name = "montant_total")
    private Double montantTotal = 0.0;

    // Relation N..1 avec Fournisseur
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fournisseur_id", nullable = false)
    private Fournisseur fournisseur;

    // Relation N..1 avec User (qui a passé la commande)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relation 1..N avec LigneCommande (cascade : si on supprime une commande, ses lignes sont supprimées)
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LigneCommande> lignes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCommande = LocalDateTime.now();
        if (this.statut == null) this.statut = StatutCommande.EN_ATTENTE;
        if (this.montantTotal == null) this.montantTotal = 0.0;
    }
}