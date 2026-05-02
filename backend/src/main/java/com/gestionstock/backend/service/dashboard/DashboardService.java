package com.gestionstock.backend.service.dashboard;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.gestionstock.backend.dto.dashboard.DashboardStatsDTO;
import com.gestionstock.backend.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service de génération des statistiques du dashboard
 * 
 * NOTE : Ce service utilise pour l'instant uniquement UserRepository
 * car les autres repositories (Produit, Fournisseur, etc.) seront créés
 * par Adnane et Kenza dans leurs parties respectives.
 * 
 * Une fois leurs repositories créés, ce service pourra être enrichi
 * avec les vraies stats.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;

    /**
     * Récupère les statistiques globales du dashboard
     */
    public DashboardStatsDTO getStats() {
        // Pour l'instant on retourne des données partiellement vraies
        // (les compteurs vrais pour User, et des données mock pour le reste)
        // Adnane et Kenza enrichiront ce service quand leurs entités seront utilisées
        
        Long totalUtilisateurs = userRepository.count();

        // Données mock pour démontrer le dashboard frontend
        Map<String, Long> ventesParMois = new HashMap<>();
        ventesParMois.put("Janvier", 45L);
        ventesParMois.put("Février", 62L);
        ventesParMois.put("Mars", 78L);
        ventesParMois.put("Avril", 91L);
        ventesParMois.put("Mai", 84L);

        Map<String, Long> topProduits = new HashMap<>();
        topProduits.put("Coca-Cola", 145L);
        topProduits.put("Pain", 132L);
        topProduits.put("Lait", 98L);
        topProduits.put("Riz", 87L);
        topProduits.put("Huile", 76L);

        List<String> produitsAlerteNoms = List.of(
                "Sucre (5 unités)",
                "Café (3 unités)",
                "Thé (2 unités)"
        );

        return DashboardStatsDTO.builder()
                .totalProduits(0L)            // À remplir par Adnane
                .totalCategories(0L)          // À remplir par Adnane
                .totalFournisseurs(0L)        // À remplir par Kenza
                .totalClients(0L)             // À remplir par Kenza
                .totalCommandes(0L)           // À remplir par Kenza
                .totalVentes(0L)              // À remplir par Kenza
                .totalUtilisateurs(totalUtilisateurs)
                .produitsStockBas(3L)         // Données mock pour l'instant
                .produitsAlerteNoms(produitsAlerteNoms)
                .valeurStockTotal(45680.50)   // Mock
                .caTotalVentes(123450.75)     // Mock
                .ventesParMois(ventesParMois)
                .topProduits(topProduits)
                .build();
    }
}