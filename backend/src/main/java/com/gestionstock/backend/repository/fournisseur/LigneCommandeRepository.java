package com.gestionstock.backend.repository.fournisseur;

import com.gestionstock.backend.entity.fournisseur.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité LigneCommande.
 * Fournit les opérations CRUD et des requêtes pour les lignes d'une commande.
 */
@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {

    /** Liste toutes les lignes d'une commande donnée */
    List<LigneCommande> findByCommandeId(Long commandeId);

    /** Liste toutes les lignes contenant un produit donné */
    List<LigneCommande> findByProduitId(Long produitId);

    /** Supprime toutes les lignes d'une commande donnée */
    void deleteByCommandeId(Long commandeId);
}
