package com.gestionstock.backend.dto.fournisseur;

import com.gestionstock.backend.entity.enums.ModePaiement;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO pour la requête de création d'une vente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenteRequest {
    private Long clientId;
    private ModePaiement modePaiement;

    @NotEmpty(message = "La vente doit contenir au moins une ligne")
    private List<LigneVenteDTO> lignes;
}
