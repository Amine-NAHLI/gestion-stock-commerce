package com.gestionstock.backend.dto.fournisseur;

import com.gestionstock.backend.entity.fournisseur.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper pour convertir entre les entités fournisseur/commande/client/vente et leurs DTOs.
 * Centralise toute la logique de conversion pour les entités de la Phase 3.
 */
@Component
public class FournisseurMapper {

    // ==================== FOURNISSEUR ====================

    /** Convertit un Fournisseur en FournisseurDTO */
    public FournisseurDTO toFournisseurDto(Fournisseur fournisseur) {
        if (fournisseur == null) return null;
        return FournisseurDTO.builder()
                .id(fournisseur.getId())
                .nom(fournisseur.getNom())
                .email(fournisseur.getEmail())
                .telephone(fournisseur.getTelephone())
                .adresse(fournisseur.getAdresse())
                .ville(fournisseur.getVille())
                .pays(fournisseur.getPays())
                .dateCreation(fournisseur.getDateCreation())
                .build();
    }

    /** Convertit un FournisseurDTO en entité Fournisseur */
    public Fournisseur toFournisseurEntity(FournisseurDTO dto) {
        if (dto == null) return null;
        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setId(dto.getId());
        fournisseur.setNom(dto.getNom());
        fournisseur.setEmail(dto.getEmail());
        fournisseur.setTelephone(dto.getTelephone());
        fournisseur.setAdresse(dto.getAdresse());
        fournisseur.setVille(dto.getVille());
        fournisseur.setPays(dto.getPays());
        return fournisseur;
    }

    // ==================== CLIENT ====================

    /** Convertit un Client en ClientDTO */
    public ClientDTO toClientDto(Client client) {
        if (client == null) return null;
        return ClientDTO.builder()
                .id(client.getId())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .email(client.getEmail())
                .telephone(client.getTelephone())
                .adresse(client.getAdresse())
                .dateCreation(client.getDateCreation())
                .build();
    }

    /** Convertit un ClientDTO en entité Client */
    public Client toClientEntity(ClientDTO dto) {
        if (dto == null) return null;
        Client client = new Client();
        client.setId(dto.getId());
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setEmail(dto.getEmail());
        client.setTelephone(dto.getTelephone());
        client.setAdresse(dto.getAdresse());
        return client;
    }

    // ==================== LIGNE COMMANDE ====================

    /** Convertit une LigneCommande en LigneCommandeDTO */
    public LigneCommandeDTO toLigneCommandeDto(LigneCommande ligne) {
        if (ligne == null) return null;
        return LigneCommandeDTO.builder()
                .id(ligne.getId())
                .produitId(ligne.getProduit() != null ? ligne.getProduit().getId() : null)
                .produitNom(ligne.getProduit() != null ? ligne.getProduit().getNom() : null)
                .produitCode(ligne.getProduit() != null ? ligne.getProduit().getCode() : null)
                .quantite(ligne.getQuantite())
                .prixUnitaire(ligne.getPrixUnitaire())
                .sousTotal(ligne.getSousTotal())
                .build();
    }

    // ==================== COMMANDE ====================

    /** Convertit une Commande en CommandeDTO (avec ses lignes) */
    public CommandeDTO toCommandeDto(Commande commande) {
        if (commande == null) return null;

        List<LigneCommandeDTO> lignesDto = commande.getLignes() != null
                ? commande.getLignes().stream().map(this::toLigneCommandeDto).collect(Collectors.toList())
                : Collections.emptyList();

        return CommandeDTO.builder()
                .id(commande.getId())
                .numero(commande.getNumero())
                .dateCommande(commande.getDateCommande())
                .dateLivraison(commande.getDateLivraison())
                .statut(commande.getStatut())
                .montantTotal(commande.getMontantTotal())
                .fournisseurId(commande.getFournisseur() != null ? commande.getFournisseur().getId() : null)
                .fournisseurNom(commande.getFournisseur() != null ? commande.getFournisseur().getNom() : null)
                .userId(commande.getUser() != null ? commande.getUser().getId() : null)
                .userNom(commande.getUser() != null ? commande.getUser().getNomComplet() : null)
                .lignes(lignesDto)
                .build();
    }

    // ==================== LIGNE VENTE ====================

    /** Convertit une LigneVente en LigneVenteDTO */
    public LigneVenteDTO toLigneVenteDto(LigneVente ligne) {
        if (ligne == null) return null;
        return LigneVenteDTO.builder()
                .id(ligne.getId())
                .produitId(ligne.getProduit() != null ? ligne.getProduit().getId() : null)
                .produitNom(ligne.getProduit() != null ? ligne.getProduit().getNom() : null)
                .produitCode(ligne.getProduit() != null ? ligne.getProduit().getCode() : null)
                .quantite(ligne.getQuantite())
                .prixUnitaire(ligne.getPrixUnitaire())
                .sousTotal(ligne.getSousTotal())
                .build();
    }

    // ==================== VENTE ====================

    /** Convertit une Vente en VenteDTO (avec ses lignes) */
    public VenteDTO toVenteDto(Vente vente) {
        if (vente == null) return null;

        List<LigneVenteDTO> lignesDto = vente.getLignes() != null
                ? vente.getLignes().stream().map(this::toLigneVenteDto).collect(Collectors.toList())
                : Collections.emptyList();

        String clientNom = null;
        if (vente.getClient() != null) {
            clientNom = vente.getClient().getNom();
            if (vente.getClient().getPrenom() != null) {
                clientNom += " " + vente.getClient().getPrenom();
            }
        }

        return VenteDTO.builder()
                .id(vente.getId())
                .numero(vente.getNumero())
                .dateVente(vente.getDateVente())
                .montantTotal(vente.getMontantTotal())
                .modePaiement(vente.getModePaiement())
                .clientId(vente.getClient() != null ? vente.getClient().getId() : null)
                .clientNom(clientNom)
                .userId(vente.getUser() != null ? vente.getUser().getId() : null)
                .userNom(vente.getUser() != null ? vente.getUser().getNomComplet() : null)
                .lignes(lignesDto)
                .build();
    }
}
