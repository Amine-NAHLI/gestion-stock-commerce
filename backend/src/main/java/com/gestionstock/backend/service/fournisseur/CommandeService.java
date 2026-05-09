package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.CommandeDTO;
import com.gestionstock.backend.dto.fournisseur.CommandeRequest;
import com.gestionstock.backend.entity.enums.StatutCommande;

import java.util.List;

/**
 * Interface du service Commande.
 * Définit les opérations métier pour la gestion des commandes fournisseurs.
 */
public interface CommandeService {

    /** Récupère toutes les commandes triées par date décroissante */
    List<CommandeDTO> getAllCommandes();

    /** Récupère une commande par son identifiant (avec ses lignes) */
    CommandeDTO getCommandeById(Long id);

    /** Récupère les commandes d'un fournisseur donné */
    List<CommandeDTO> getCommandesByFournisseur(Long fournisseurId);

    /** Récupère les commandes par statut */
    List<CommandeDTO> getCommandesByStatut(StatutCommande statut);

    /** Crée une nouvelle commande avec ses lignes */
    CommandeDTO createCommande(CommandeRequest request);

    /** Met à jour le statut d'une commande (et gère le stock si LIVREE) */
    CommandeDTO updateStatut(Long id, StatutCommande statut);

    /** Supprime une commande (uniquement si EN_ATTENTE) */
    void deleteCommande(Long id);
}
