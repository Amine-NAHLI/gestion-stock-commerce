package com.gestionstock.backend.controller.fournisseur;

import com.gestionstock.backend.dto.fournisseur.VenteDTO;
import com.gestionstock.backend.dto.fournisseur.VenteRequest;
import com.gestionstock.backend.service.fournisseur.VenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des ventes (point de vente).
 * Expose les endpoints pour créer et consulter des ventes.
 */
@RestController
@RequestMapping("/api/ventes")
@RequiredArgsConstructor
public class VenteController {

    private final VenteService venteService;

    /** GET /api/ventes — Liste toutes les ventes */
    @GetMapping
    public ResponseEntity<List<VenteDTO>> getAllVentes() {
        return ResponseEntity.ok(venteService.getAllVentes());
    }

    /** GET /api/ventes/{id} — Récupère une vente avec ses lignes */
    @GetMapping("/{id}")
    public ResponseEntity<VenteDTO> getVenteById(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.getVenteById(id));
    }

    /** GET /api/ventes/client/{clientId} — Ventes d'un client */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<VenteDTO>> getVentesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(venteService.getVentesByClient(clientId));
    }

    /**
     * POST /api/ventes — Crée une nouvelle vente
     * Body: { "clientId": 1 (optionnel), "modePaiement": "ESPECES", "lignes": [...] }
     */
    @PostMapping
    public ResponseEntity<VenteDTO> createVente(@Valid @RequestBody VenteRequest request) {
        return new ResponseEntity<>(
                venteService.createVente(request.getClientId(), request.getModePaiement(), request.getLignes()),
                HttpStatus.CREATED
        );
    }

    /** DELETE /api/ventes/{id} — Supprime une vente */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVente(@PathVariable Long id) {
        venteService.deleteVente(id);
        return ResponseEntity.noContent().build();
    }
}
