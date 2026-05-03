package com.gestionstock.backend.controller.produit;

import com.gestionstock.backend.dto.produit.CategorieDTO;
import com.gestionstock.backend.service.produit.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final ProduitService produitService;

    @GetMapping
    public ResponseEntity<List<CategorieDTO>> getAllCategories() {
        return ResponseEntity.ok(produitService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieDTO> getCategorieById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getCategorieById(id));
    }

    @PostMapping
    public ResponseEntity<CategorieDTO> createCategorie(@RequestBody CategorieDTO categorieDTO) {
        return new ResponseEntity<>(produitService.createCategorie(categorieDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategorieDTO> updateCategorie(@PathVariable Long id, @RequestBody CategorieDTO categorieDTO) {
        return ResponseEntity.ok(produitService.updateCategorie(id, categorieDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        produitService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
}
