package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.fournisseur.LigneVente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité LigneVente.
 * Fournit les opérations CRUD et des requêtes pour les lignes d'une vente.
 */
@Repository
public interface LigneVenteRepository extends JpaRepository<LigneVente, Long> {

    /** Liste toutes les lignes d'une vente donnée */
    List<LigneVente> findByVenteId(Long venteId);

    /** Liste toutes les lignes contenant un produit donné */
    List<LigneVente> findByProduitId(Long produitId);

    /** Supprime toutes les lignes d'une vente donnée */
    void deleteByVenteId(Long venteId);
}
