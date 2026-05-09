package com.gestionstock.backend.service.dashboard;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.gestionstock.backend.dto.dashboard.DashboardStatsDTO;
import com.gestionstock.backend.entity.fournisseur.LigneVente;
import com.gestionstock.backend.entity.fournisseur.Vente;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.auth.UserRepository;
import com.gestionstock.backend.repository.fournisseur.*;
import com.gestionstock.backend.repository.produit.CategorieRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service de génération des statistiques du dashboard.
 * Récupère les données réelles depuis tous les repositories de l'application.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ClientRepository clientRepository;
    private final CommandeRepository commandeRepository;
    private final VenteRepository venteRepository;

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
        List<Produit> tousProduits = produitRepository.findAll();
        List<Produit> produitsEnAlerte = tousProduits.stream()
                .filter(p -> p.getQuantiteStock() <= (p.getSeuilAlerte() != null ? p.getSeuilAlerte() : 0))
                .collect(Collectors.toList());

        List<String> produitsAlerteNoms = produitsEnAlerte.stream()
                .limit(5) // On n'affiche que les 5 premiers pour ne pas surcharger
                .map(p -> p.getNom() + " (" + p.getQuantiteStock() + " " + (p.getUnite() != null ? p.getUnite() : "u") + ")")
                .collect(Collectors.toList());

        // 3. Stats financières
        Double valeurStockTotal = tousProduits.stream()
                .mapToDouble(p -> p.getQuantiteStock() * (p.getPrixAchat() != null ? p.getPrixAchat() : 0))
                .sum();

        List<Vente> toutesVentes = venteRepository.findAll();
        Double caTotalVentes = toutesVentes.stream()
                .mapToDouble(v -> v.getMontantTotal() != null ? v.getMontantTotal() : 0)
                .sum();

        // 4. Stats par mois (pour graphique)
        Map<String, Long> ventesParMois = new LinkedHashMap<>();
        // On initialise les 6 derniers mois
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthDate = now.minusMonths(i);
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.FULL, Locale.FRENCH);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            final int targetMonth = monthDate.getMonthValue();
            final int targetYear = monthDate.getYear();

            long count = toutesVentes.stream()
                    .filter(v -> v.getDateVente().getMonthValue() == targetMonth && v.getDateVente().getYear() == targetYear)
                    .count();

            ventesParMois.put(monthName, count);
        }

        // 5. Top produits (pour graphique)
        Map<String, Long> topProduits = new HashMap<>();
        Map<String, Long> productSales = toutesVentes.stream()
                .flatMap(v -> v.getLignes().stream())
                .collect(Collectors.groupingBy(
                        lv -> lv.getProduit().getNom(),
                        Collectors.summingLong(LigneVente::getQuantite)
                ));

        topProduits = productSales.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));

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