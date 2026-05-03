package com.gestionstock.backend.service.produit;

import com.gestionstock.backend.dto.produit.MouvementStockDTO;

import java.util.List;

public interface MouvementStockService {
    List<MouvementStockDTO> getAllMouvements();
    List<MouvementStockDTO> getMouvementsByProduit(Long produitId);
    MouvementStockDTO enregistrerMouvement(MouvementStockDTO mouvementDTO);
}
