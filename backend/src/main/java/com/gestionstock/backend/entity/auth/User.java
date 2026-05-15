package com.gestionstock.backend.entity.auth;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password; // Sera encodé en BCrypt

    @Column(name = "nom_complet", length = 100)
    private String nomComplet;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "email_verifie", nullable = false)
    private Boolean emailVerifie = false;

    @Column(name = "en_attente_approbation", nullable = false)
    private Boolean enAttenteApprobation = false;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    // Relation N..1 avec Role
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // Méthode appelée automatiquement avant l'insertion en BDD
    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.actif == null) {
            this.actif = true;
        }
        if (this.emailVerifie == null) {
            this.emailVerifie = false;
        }
        if (this.enAttenteApprobation == null) {
            this.enAttenteApprobation = false;
        }
    }
}
