package com.gestionstock.backend.controller.produit;

import com.gestionstock.backend.dto.produit.MouvementStockDTO;
import com.gestionstock.backend.service.produit.MouvementStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mouvements")
@RequiredArgsConstructor
public class MouvementStockController {

    private final MouvementStockService mouvementService;

    @GetMapping
    public ResponseEntity<List<MouvementStockDTO>> getAllMouvements() {
        return ResponseEntity.ok(mouvementService.getAllMouvements());
    }

    @GetMapping("/produit/{produitId}")
    public ResponseEntity<List<MouvementStockDTO>> getMouvementsByProduit(@PathVariable Long produitId) {
        return ResponseEntity.ok(mouvementService.getMouvementsByProduit(produitId));
    }

    @PostMapping
    public ResponseEntity<MouvementStockDTO> enregistrerMouvement(@RequestBody MouvementStockDTO mouvementDTO) {
        return new ResponseEntity<>(mouvementService.enregistrerMouvement(mouvementDTO), HttpStatus.CREATED);
    }
}
