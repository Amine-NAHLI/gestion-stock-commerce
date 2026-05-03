package com.gestionstock.backend.service.produit;

import com.gestionstock.backend.dto.produit.CategorieDTO;
import com.gestionstock.backend.dto.produit.ProduitDTO;
import com.gestionstock.backend.dto.produit.ProduitMapper;
import com.gestionstock.backend.entity.fournisseur.Fournisseur;
import com.gestionstock.backend.entity.produit.Categorie;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.fournisseur.FournisseurRepository;
import com.gestionstock.backend.repository.produit.CategorieRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProduitServiceImpl implements ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ProduitMapper produitMapper;

    @Override
    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll().stream()
                .map(produitMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProduitDTO getProduitById(Long id) {
        return produitRepository.findById(id)
                .map(produitMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));
    }

    @Override
    public ProduitDTO getProduitByCode(String code) {
        return produitRepository.findByCode(code)
                .map(produitMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec le code : " + code));
    }

    @Override
    public ProduitDTO createProduit(ProduitDTO produitDTO) {
        Produit produit = produitMapper.toEntity(produitDTO);
        
        if (produitDTO.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            produit.setCategorie(categorie);
        }

        if (produitDTO.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(produitDTO.getFournisseurId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            produit.setFournisseur(fournisseur);
        }

        return produitMapper.toDto(produitRepository.save(produit));
    }

    @Override
    public ProduitDTO updateProduit(Long id, ProduitDTO produitDTO) {
        Produit existingProduit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        existingProduit.setNom(produitDTO.getNom());
        existingProduit.setCode(produitDTO.getCode());
        existingProduit.setDescription(produitDTO.getDescription());
        existingProduit.setPrixAchat(produitDTO.getPrixAchat());
        existingProduit.setPrixVente(produitDTO.getPrixVente());
        existingProduit.setQuantiteStock(produitDTO.getQuantiteStock());
        existingProduit.setSeuilAlerte(produitDTO.getSeuilAlerte());
        existingProduit.setUnite(produitDTO.getUnite());
        existingProduit.setImage(produitDTO.getImage());

        if (produitDTO.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            existingProduit.setCategorie(categorie);
        }

        if (produitDTO.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(produitDTO.getFournisseurId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            existingProduit.setFournisseur(fournisseur);
        }

        return produitMapper.toDto(produitRepository.save(existingProduit));
    }

    @Override
    public void deleteProduit(Long id) {
        produitRepository.deleteById(id);
    }

    // Categories
    @Override
    public List<CategorieDTO> getAllCategories() {
        return categorieRepository.findAll().stream()
                .map(produitMapper::toCategorieDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategorieDTO getCategorieById(Long id) {
        return categorieRepository.findById(id)
                .map(produitMapper::toCategorieDto)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
    }

    @Override
    public CategorieDTO createCategorie(CategorieDTO categorieDTO) {
        Categorie categorie = produitMapper.toCategorieEntity(categorieDTO);
        return produitMapper.toCategorieDto(categorieRepository.save(categorie));
    }

    @Override
    public CategorieDTO updateCategorie(Long id, CategorieDTO categorieDTO) {
        Categorie existingCategorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        
        existingCategorie.setNom(categorieDTO.getNom());
        existingCategorie.setDescription(categorieDTO.getDescription());
        
        return produitMapper.toCategorieDto(categorieRepository.save(existingCategorie));
    }

    @Override
    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }
}
