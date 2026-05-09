package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.FournisseurDTO;

import java.util.List;

/**
 * Interface du service Fournisseur.
 * Définit les opérations métier pour la gestion des fournisseurs.
 */
public interface FournisseurService {

    /** Récupère tous les fournisseurs */
    List<FournisseurDTO> getAllFournisseurs();

    /** Récupère un fournisseur par son identifiant */
    FournisseurDTO getFournisseurById(Long id);

    /** Recherche les fournisseurs par nom (recherche partielle) */
    List<FournisseurDTO> searchFournisseurs(String nom);

    /** Crée un nouveau fournisseur */
    FournisseurDTO createFournisseur(FournisseurDTO fournisseurDTO);

    /** Met à jour un fournisseur existant */
    FournisseurDTO updateFournisseur(Long id, FournisseurDTO fournisseurDTO);

    /** Supprime un fournisseur par son identifiant */
    void deleteFournisseur(Long id);
}
