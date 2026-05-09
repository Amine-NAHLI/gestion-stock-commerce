package com.gestionstock.backend.controller.fournisseur;

import com.gestionstock.backend.dto.fournisseur.FournisseurDTO;
import com.gestionstock.backend.service.fournisseur.FournisseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des fournisseurs.
 * Expose les endpoints CRUD pour les fournisseurs.
 */
@RestController
@RequestMapping("/api/fournisseurs")
@RequiredArgsConstructor
public class FournisseurController {

    private final FournisseurService fournisseurService;

    /** GET /api/fournisseurs — Liste tous les fournisseurs */
    @GetMapping
    public ResponseEntity<List<FournisseurDTO>> getAllFournisseurs() {
        return ResponseEntity.ok(fournisseurService.getAllFournisseurs());
    }

    /** GET /api/fournisseurs/{id} — Récupère un fournisseur par ID */
    @GetMapping("/{id}")
    public ResponseEntity<FournisseurDTO> getFournisseurById(@PathVariable Long id) {
        return ResponseEntity.ok(fournisseurService.getFournisseurById(id));
    }

    /** GET /api/fournisseurs/search?nom=... — Recherche par nom */
    @GetMapping("/search")
    public ResponseEntity<List<FournisseurDTO>> searchFournisseurs(@RequestParam String nom) {
        return ResponseEntity.ok(fournisseurService.searchFournisseurs(nom));
    }

    /** POST /api/fournisseurs — Crée un nouveau fournisseur */
    @PostMapping
    public ResponseEntity<FournisseurDTO> createFournisseur(@RequestBody FournisseurDTO fournisseurDTO) {
        return new ResponseEntity<>(fournisseurService.createFournisseur(fournisseurDTO), HttpStatus.CREATED);
    }

    /** PUT /api/fournisseurs/{id} — Met à jour un fournisseur */
    @PutMapping("/{id}")
    public ResponseEntity<FournisseurDTO> updateFournisseur(@PathVariable Long id, @RequestBody FournisseurDTO fournisseurDTO) {
        return ResponseEntity.ok(fournisseurService.updateFournisseur(id, fournisseurDTO));
    }

    /** DELETE /api/fournisseurs/{id} — Supprime un fournisseur */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }
}
