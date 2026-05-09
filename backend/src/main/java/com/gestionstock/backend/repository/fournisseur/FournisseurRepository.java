package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.fournisseur.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Fournisseur.
 * Fournit les opérations CRUD et des requêtes personnalisées.
 */
@Repository

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {

    /** Recherche un fournisseur par son email */

    Optional<Fournisseur> findByEmail(String email);

    /**
     * Recherche les fournisseurs dont le nom contient la chaîne (insensible à la
     * casse)
     */
    List<Fournisseur> findByNomContainingIgnoreCase(String nom);

    /** Vérifie si un fournisseur existe avec cet email */
    boolean existsByEmail(String email);
}
