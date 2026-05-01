package com.gestionstock.backend.entity.produit;

import java.time.LocalDateTime;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.enums.TypeMouvement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mouvements_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_mouvement", nullable = false, length = 20)
    private TypeMouvement typeMouvement;

    @Column(nullable = false)
    private Integer quantite;

    @Column(length = 500)
    private String motif; // Ex: "Vente", "Réception commande", "Casse", "Inventaire"

    @Column(name = "date_mouvement", nullable = false, updatable = false)
    private LocalDateTime dateMouvement;

    // Relation N..1 avec Produit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    // Relation N..1 avec User (qui a effectué le mouvement)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.dateMouvement = LocalDateTime.now();
    }
}