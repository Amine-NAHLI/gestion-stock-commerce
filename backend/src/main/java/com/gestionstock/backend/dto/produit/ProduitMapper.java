package com.gestionstock.backend.dto.produit;

import com.gestionstock.backend.entity.produit.Categorie;
import com.gestionstock.backend.entity.produit.MouvementStock;
import com.gestionstock.backend.entity.produit.Produit;
import org.springframework.stereotype.Component;

@Component
public class ProduitMapper {

    public ProduitDTO toDto(Produit produit) {
        if (produit == null) return null;
        
        ProduitDTO dto = ProduitDTO.builder()
                .id(produit.getId())
                .code(produit.getCode())
                .nom(produit.getNom())
                .description(produit.getDescription())
                .prixAchat(produit.getPrixAchat())
                .prixVente(produit.getPrixVente())
                .quantiteStock(produit.getQuantiteStock())
                .seuilAlerte(produit.getSeuilAlerte())
                .unite(produit.getUnite())
                .image(produit.getImage())
                .dateCreation(produit.getDateCreation())
                .dateModification(produit.getDateModification())
                .build();

        if (produit.getCategorie() != null) {
            dto.setCategorieId(produit.getCategorie().getId());
            dto.setCategorieNom(produit.getCategorie().getNom());
        }

        if (produit.getFournisseur() != null) {
            dto.setFournisseurId(produit.getFournisseur().getId());
            dto.setFournisseurNom(produit.getFournisseur().getNom());
        }

        return dto;
    }

    public Produit toEntity(ProduitDTO dto) {
        if (dto == null) return null;

        Produit produit = new Produit();
        produit.setId(dto.getId());
        produit.setCode(dto.getCode());
        produit.setNom(dto.getNom());
        produit.setDescription(dto.getDescription());
        produit.setPrixAchat(dto.getPrixAchat());
        produit.setPrixVente(dto.getPrixVente());
        produit.setQuantiteStock(dto.getQuantiteStock());
        produit.setSeuilAlerte(dto.getSeuilAlerte());
        produit.setUnite(dto.getUnite());
        produit.setImage(dto.getImage());
        
        return produit;
    }

    public CategorieDTO toCategorieDto(Categorie categorie) {
        if (categorie == null) return null;
        return CategorieDTO.builder()
                .id(categorie.getId())
                .nom(categorie.getNom())
                .description(categorie.getDescription())
                .dateCreation(categorie.getDateCreation())
                .build();
    }

    public Categorie toCategorieEntity(CategorieDTO dto) {
        if (dto == null) return null;
        Categorie categorie = new Categorie();
        categorie.setId(dto.getId());
        categorie.setNom(dto.getNom());
        categorie.setDescription(dto.getDescription());
        return categorie;
    }

    public MouvementStockDTO toMouvementDto(MouvementStock mvt) {
        if (mvt == null) return null;
        return MouvementStockDTO.builder()
                .id(mvt.getId())
                .produitId(mvt.getProduit().getId())
                .produitNom(mvt.getProduit().getNom())
                .produitCode(mvt.getProduit().getCode())
                .quantite(mvt.getQuantite())
                .type(mvt.getType())
                .motif(mvt.getMotif())
                .dateMouvement(mvt.getDateMouvement())
                .build();
    }

    public MouvementStock toMouvementEntity(MouvementStockDTO dto) {
        if (dto == null) return null;
        MouvementStock mvt = new MouvementStock();
        mvt.setId(dto.getId());
        mvt.setQuantite(dto.getQuantite());
        mvt.setType(dto.getType());
        mvt.setMotif(dto.getMotif());
        // Note: Le produit doit être géré dans le service
        return mvt;
    }
}
