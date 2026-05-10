package com.gestionstock.backend.service.dashboard;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionstock.backend.dto.dashboard.DashboardStatsDTO;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.auth.UserRepository;
import com.gestionstock.backend.repository.fournisseur.*;
import com.gestionstock.backend.repository.produit.CategorieRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

/**
 * Service de génération des statistiques du dashboard.
 * Optimisé avec des requêtes JPQL pour éviter les problèmes de mémoire (OOM).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DashboardService {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ClientRepository clientRepository;
    private final CommandeRepository commandeRepository;
    private final VenteRepository venteRepository;
    private final EntityManager entityManager;

    /**
     * Récupère les statistiques globales du dashboard.
     */
    public DashboardStatsDTO getStats() {
        // 1. Compteurs globaux
        Long totalUtilisateurs = userRepository.count();
        Long totalProduits = produitRepository.count();
        Long totalCategories = categorieRepository.count();
        Long totalFournisseurs = fournisseurRepository.count();
        Long totalClients = clientRepository.count();
        Long totalCommandes = commandeRepository.count();
        Long totalVentes = venteRepository.count();

        // 2. Alertes Stock
        List<Produit> produitsEnAlerte = entityManager.createQuery(
                "SELECT p FROM Produit p WHERE p.quantiteStock <= COALESCE(p.seuilAlerte, 0)", Produit.class)
                .getResultList();

        List<String> produitsAlerteNoms = produitsEnAlerte.stream()
                .limit(5)
                .map(p -> p.getNom() + " (" + p.getQuantiteStock() + " " + (p.getUnite() != null ? p.getUnite() : "u") + ")")
                .collect(Collectors.toList());

        // 3. Stats financières
        Double valeurStockTotal = (Double) entityManager.createQuery(
                "SELECT COALESCE(SUM(COALESCE(p.quantiteStock, 0) * COALESCE(p.prixAchat, 0)), 0.0) FROM Produit p")
                .getSingleResult();

        Double caTotalVentes = (Double) entityManager.createQuery(
                "SELECT COALESCE(SUM(v.montantTotal), 0.0) FROM Vente v")
                .getSingleResult();

        // 4. Stats par mois (pour graphique)
        Map<String, Long> ventesParMois = new LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthDate = now.minusMonths(i);
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.FULL, Locale.FRENCH);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            int targetMonth = monthDate.getMonthValue();
            int targetYear = monthDate.getYear();

            Long count = (Long) entityManager.createQuery(
                    "SELECT COUNT(v) FROM Vente v WHERE MONTH(v.dateVente) = :m AND YEAR(v.dateVente) = :y")
                    .setParameter("m", targetMonth)
                    .setParameter("y", targetYear)
                    .getSingleResult();

            ventesParMois.put(monthName, count);
        }

        // 5. Top produits (pour graphique)
        List<Object[]> topProductsData = entityManager.createQuery(
                "SELECT lv.produit.nom, SUM(lv.quantite) FROM LigneVente lv GROUP BY lv.produit.nom ORDER BY SUM(lv.quantite) DESC", Object[].class)
                .setMaxResults(5)
                .getResultList();

        Map<String, Long> topProduits = new LinkedHashMap<>();
        for (Object[] row : topProductsData) {
            topProduits.put((String) row[0], ((Number) row[1]).longValue());
        }

        return DashboardStatsDTO.builder()
                .totalProduits(totalProduits)
                .totalCategories(totalCategories)
                .totalFournisseurs(totalFournisseurs)
                .totalClients(totalClients)
                .totalCommandes(totalCommandes)
                .totalVentes(totalVentes)
                .totalUtilisateurs(totalUtilisateurs)
                .produitsStockBas((long) produitsEnAlerte.size())
                .produitsAlerteNoms(produitsAlerteNoms)
                .valeurStockTotal(valeurStockTotal)
                .caTotalVentes(caTotalVentes)
                .ventesParMois(ventesParMois)
                .topProduits(topProduits)
                .build();
    }
}