package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.enums.StatutCommande;
import com.gestionstock.backend.entity.fournisseur.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Commande.
 * Fournit les opérations CRUD et des requêtes personnalisées pour les commandes fournisseurs.
 */
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    /** Recherche une commande par son numéro unique (ex: CMD-2026-001) */
    Optional<Commande> findByNumero(String numero);

    /** Liste toutes les commandes d'un fournisseur donné */
    List<Commande> findByFournisseurIdOrderByDateCommandeDesc(Long fournisseurId);

    /** Liste toutes les commandes par statut */
    List<Commande> findByStatutOrderByDateCommandeDesc(StatutCommande statut);

    /** Liste toutes les commandes entre deux dates */
    List<Commande> findByDateCommandeBetweenOrderByDateCommandeDesc(LocalDateTime debut, LocalDateTime fin);

    /** Liste toutes les commandes triées par date décroissante */
    List<Commande> findAllByOrderByDateCommandeDesc();

    /** Compte le nombre de commandes par statut */
    long countByStatut(StatutCommande statut);
}
