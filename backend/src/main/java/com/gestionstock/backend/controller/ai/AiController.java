package com.gestionstock.backend.controller.ai;

import com.gestionstock.backend.dto.dashboard.DashboardStatsDTO;
import com.gestionstock.backend.service.ai.GroqService;
import com.gestionstock.backend.service.dashboard.DashboardService;
import com.gestionstock.backend.service.produit.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final GroqService groqService;
    private final ProduitService produitService;
    private final DashboardService dashboardService;

    @GetMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestParam String productName) {
        String prompt = "Agis en tant qu'expert en marketing pour un commerce. " +
                "Génère une description courte (maximum 3 phrases) et attrayante pour un produit dont le nom est : '" + productName + "'. " +
                "La description doit mettre en avant la qualité et l'utilité du produit. Réponds uniquement avec la description.";
        
        String description = groqService.generateResponse(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("description", description);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/marketing-advice")
    public ResponseEntity<Map<String, String>> getMarketingAdvice() {
        DashboardStatsDTO stats = dashboardService.getStats();
        
        String prompt = String.format(
            "Agis en tant qu'expert en Business Intelligence pour un commerce. Voici les données actuelles de mon magasin :\n" +
            "- Nombre total de produits : %d\n" +
            "- Valeur totale du stock : %.2f MAD\n" +
            "- Chiffre d'affaires total : %.2f MAD\n" +
            "- Nombre de ventes : %d\n" +
            "- Nombre de fournisseurs : %d\n" +
            "- Nombre d'utilisateurs système : %d\n\n" +
            "Basé sur ces chiffres, donne-moi 3 conseils marketing très CONCRETS et PERSONNALISÉS pour augmenter mon chiffre d'affaires ce mois-ci. " +
            "Sois direct, professionnel et réponds en français sous forme de liste à puces.",
            stats.getTotalProduits(), stats.getValeurStockTotal(), stats.getCaTotalVentes(),
            stats.getTotalVentes(), stats.getTotalFournisseurs(), stats.getTotalUtilisateurs()
        );
        
        String advice = groqService.generateResponse(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("advice", advice);
        return ResponseEntity.ok(response);
    }
}
