package com.gestionstock.backend.dto.fournisseur;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO de requête pour la création d'une commande.
 * Contient le fournisseur cible et la liste des lignes de commande.
 * Utilisé lors de la réception d'une requête POST pour créer une commande.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommandeRequest {

    @NotNull(message = "Le fournisseur est obligatoire")
    private Long fournisseurId;

    @NotEmpty(message = "La commande doit contenir au moins une ligne")
    private List<LigneCommandeDTO> lignes;
}
