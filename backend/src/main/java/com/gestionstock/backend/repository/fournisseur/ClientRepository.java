package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.fournisseur.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Client.
 * Fournit les opérations CRUD et des requêtes personnalisées.
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    /** Recherche un client par son email */
    Optional<Client> findByEmail(String email);

    /** Recherche les clients dont le nom contient la chaîne (insensible à la casse) */
    List<Client> findByNomContainingIgnoreCase(String nom);

    /** Recherche les clients dont le nom ou le prénom contient la chaîne */
    List<Client> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    /** Vérifie si un client existe avec cet email */
    boolean existsByEmail(String email);
}
