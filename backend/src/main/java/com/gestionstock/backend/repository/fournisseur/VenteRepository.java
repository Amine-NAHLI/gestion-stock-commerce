package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.fournisseur.Vente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Vente.
 * Fournit les opérations CRUD et des requêtes personnalisées pour les ventes.
 */
@Repository
public interface VenteRepository extends JpaRepository<Vente, Long> {

    /** Recherche une vente par son numéro unique (ex: VTE-2026-001) */
    Optional<Vente> findByNumero(String numero);

    /** Liste toutes les ventes d'un client donné */
    List<Vente> findByClientIdOrderByDateVenteDesc(Long clientId);

    /** Liste toutes les ventes entre deux dates */
    List<Vente> findByDateVenteBetweenOrderByDateVenteDesc(LocalDateTime debut, LocalDateTime fin);

    /** Liste toutes les ventes triées par date décroissante */
    List<Vente> findAllByOrderByDateVenteDesc();

    /** Calcule le chiffre d'affaires total entre deux dates */
    @Query("SELECT COALESCE(SUM(v.montantTotal), 0) FROM Vente v WHERE v.dateVente BETWEEN :debut AND :fin")
    Double calculerChiffreAffaires(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    /** Compte le nombre de ventes entre deux dates */
    long countByDateVenteBetween(LocalDateTime debut, LocalDateTime fin);
}
