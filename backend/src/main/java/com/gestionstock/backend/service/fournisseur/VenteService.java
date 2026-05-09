package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.LigneVenteDTO;
import com.gestionstock.backend.dto.fournisseur.VenteDTO;
import com.gestionstock.backend.entity.enums.ModePaiement;

import java.util.List;

/**
 * Interface du service Vente.
 * Définit les opérations métier pour la gestion des ventes (point de vente).
 */
public interface VenteService {

    /** Récupère toutes les ventes triées par date décroissante */
    List<VenteDTO> getAllVentes();

    /** Récupère une vente par son identifiant (avec ses lignes) */
    VenteDTO getVenteById(Long id);

    /** Récupère les ventes d'un client donné */
    List<VenteDTO> getVentesByClient(Long clientId);

    /** Crée une nouvelle vente (point de vente) avec ses lignes, met à jour le stock */
    VenteDTO createVente(Long clientId, ModePaiement modePaiement, List<LigneVenteDTO> lignes);

    /** Supprime une vente par son identifiant */
    void deleteVente(Long id);
}
