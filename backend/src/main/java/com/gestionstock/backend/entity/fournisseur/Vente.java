package com.gestionstock.backend.entity.fournisseur;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.enums.ModePaiement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ventes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String numero; // Ex: VTE-2026-001

    @Column(name = "date_vente", nullable = false, updatable = false)
    private LocalDateTime dateVente;

    @Column(name = "montant_total")
    private Double montantTotal = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement", length = 20)
    private ModePaiement modePaiement = ModePaiement.ESPECES;

    // Relation N..1 avec Client (peut être null pour vente à un client occasionnel)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    // Relation N..1 avec User (le vendeur)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relation 1..N avec LigneVente
    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LigneVente> lignes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateVente = LocalDateTime.now();
        if (this.modePaiement == null) this.modePaiement = ModePaiement.ESPECES;
        if (this.montantTotal == null) this.montantTotal = 0.0;
    }
}