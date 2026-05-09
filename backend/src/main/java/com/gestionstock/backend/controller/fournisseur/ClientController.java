package com.gestionstock.backend.controller.fournisseur;

import com.gestionstock.backend.dto.fournisseur.ClientDTO;
import com.gestionstock.backend.service.fournisseur.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des clients.
 * Expose les endpoints CRUD pour les clients.
 */
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    /** GET /api/clients — Liste tous les clients */
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    /** GET /api/clients/{id} — Récupère un client par ID */
    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    /** GET /api/clients/search?q=... — Recherche par nom ou prénom */
    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(@RequestParam String q) {
        return ResponseEntity.ok(clientService.searchClients(q));
    }

    /** POST /api/clients — Crée un nouveau client */
    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        return new ResponseEntity<>(clientService.createClient(clientDTO), HttpStatus.CREATED);
    }

    /** PUT /api/clients/{id} — Met à jour un client */
    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientDTO));
    }

    /** DELETE /api/clients/{id} — Supprime un client */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
