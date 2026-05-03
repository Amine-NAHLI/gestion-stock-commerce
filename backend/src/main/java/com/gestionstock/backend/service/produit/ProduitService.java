package com.gestionstock.backend.service.produit;

import com.gestionstock.backend.dto.produit.CategorieDTO;
import com.gestionstock.backend.dto.produit.ProduitDTO;

import java.util.List;

public interface ProduitService {
    // Produits
    List<ProduitDTO> getAllProduits();
    ProduitDTO getProduitById(Long id);
    ProduitDTO getProduitByCode(String code);
    ProduitDTO createProduit(ProduitDTO produitDTO);
    ProduitDTO updateProduit(Long id, ProduitDTO produitDTO);
    void deleteProduit(Long id);

    // Categories
    List<CategorieDTO> getAllCategories();
    CategorieDTO getCategorieById(Long id);
    CategorieDTO createCategorie(CategorieDTO categorieDTO);
    CategorieDTO updateCategorie(Long id, CategorieDTO categorieDTO);
    void deleteCategorie(Long id);
}
