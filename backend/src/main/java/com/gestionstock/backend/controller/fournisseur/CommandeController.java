package com.gestionstock.backend.controller.fournisseur;

import com.gestionstock.backend.dto.fournisseur.CommandeDTO;
import com.gestionstock.backend.dto.fournisseur.CommandeRequest;
import com.gestionstock.backend.entity.enums.StatutCommande;
import com.gestionstock.backend.service.fournisseur.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des commandes fournisseurs.
 * Expose les endpoints pour créer, consulter, modifier le statut et supprimer des commandes.
 */
@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;

    /** GET /api/commandes — Liste toutes les commandes */
    @GetMapping
    public ResponseEntity<List<CommandeDTO>> getAllCommandes() {
        return ResponseEntity.ok(commandeService.getAllCommandes());
    }

    /** GET /api/commandes/{id} — Récupère une commande avec ses lignes */
    @GetMapping("/{id}")
    public ResponseEntity<CommandeDTO> getCommandeById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommandeById(id));
    }

    /** GET /api/commandes/fournisseur/{id} — Commandes d'un fournisseur */
    @GetMapping("/fournisseur/{fournisseurId}")
    public ResponseEntity<List<CommandeDTO>> getCommandesByFournisseur(@PathVariable Long fournisseurId) {
        return ResponseEntity.ok(commandeService.getCommandesByFournisseur(fournisseurId));
    }

    /** GET /api/commandes/statut/{statut} — Commandes par statut */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CommandeDTO>> getCommandesByStatut(@PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.getCommandesByStatut(statut));
    }

    /** POST /api/commandes — Crée une nouvelle commande multi-lignes */
    @PostMapping
    public ResponseEntity<CommandeDTO> createCommande(@Valid @RequestBody CommandeRequest request) {
        return new ResponseEntity<>(commandeService.createCommande(request), HttpStatus.CREATED);
    }

    /** PUT /api/commandes/{id}/statut?statut=... — Met à jour le statut d'une commande */
    @PutMapping("/{id}/statut")
    public ResponseEntity<CommandeDTO> updateStatut(@PathVariable Long id, @RequestParam StatutCommande statut) {
        return ResponseEntity.ok(commandeService.updateStatut(id, statut));
    }

    /** DELETE /api/commandes/{id} — Supprime une commande (EN_ATTENTE uniquement) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }
}
