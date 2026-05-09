package com.gestionstock.backend.dto.fournisseur;

import com.gestionstock.backend.entity.enums.ModePaiement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO pour l'entité Vente.
 * Contient toutes les informations d'une vente, y compris ses lignes.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VenteDTO {
    private Long id;
    private String numero;
    private LocalDateTime dateVente;
    private Double montantTotal;
    private ModePaiement modePaiement;
    private Long clientId;
    private String clientNom;
    private Long userId;
    private String userNom;
    private List<LigneVenteDTO> lignes;
}
