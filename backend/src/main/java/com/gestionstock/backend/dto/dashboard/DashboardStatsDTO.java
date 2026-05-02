package com.gestionstock.backend.dto.dashboard;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO contenant toutes les statistiques du dashboard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // Compteurs globaux
    private Long totalProduits;
    private Long totalCategories;
    private Long totalFournisseurs;
    private Long totalClients;
    private Long totalCommandes;
    private Long totalVentes;
    private Long totalUtilisateurs;

    // Alertes
    private Long produitsStockBas;
    private List<String> produitsAlerteNoms; // Noms des produits en alerte

    // Stats financières
    private Double valeurStockTotal; // Somme (quantité × prixAchat)
    private Double caTotalVentes; // Chiffre d'affaires total

    // Stats par mois (pour graphique)
    private Map<String, Long> ventesParMois;

    // Top produits (pour graphique)
    private Map<String, Long> topProduits;
}