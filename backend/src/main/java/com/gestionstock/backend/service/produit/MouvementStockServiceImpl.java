package com.gestionstock.backend.service.produit;

import com.gestionstock.backend.dto.produit.MouvementStockDTO;
import com.gestionstock.backend.dto.produit.ProduitMapper;
import com.gestionstock.backend.entity.produit.MouvementStock;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.entity.produit.TypeMouvement;
import com.gestionstock.backend.repository.produit.MouvementStockRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MouvementStockServiceImpl implements MouvementStockService {

    private final MouvementStockRepository mouvementRepository;
    private final ProduitRepository produitRepository;
    private final ProduitMapper produitMapper;

    @Override
    public List<MouvementStockDTO> getAllMouvements() {
        return mouvementRepository.findAllByOrderByDateMouvementDesc().stream()
                .map(produitMapper::toMouvementDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MouvementStockDTO> getMouvementsByProduit(Long produitId) {
        return mouvementRepository.findByProduitIdOrderByDateMouvementDesc(produitId).stream()
                .map(produitMapper::toMouvementDto)
                .collect(Collectors.toList());
    }

    @Override
    public MouvementStockDTO enregistrerMouvement(MouvementStockDTO mouvementDTO) {
        Produit produit = produitRepository.findById(mouvementDTO.getProduitId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        MouvementStock mouvement = produitMapper.toMouvementEntity(mouvementDTO);
        mouvement.setProduit(produit);

        // Mise à jour du stock réel du produit
        double nouvelleQuantite = produit.getQuantiteStock();
        
        if (mouvement.getType() == TypeMouvement.ENTREE || mouvement.getType() == TypeMouvement.RETOUR) {
            nouvelleQuantite += mouvement.getQuantite();
        } else if (mouvement.getType() == TypeMouvement.SORTIE) {
            if (nouvelleQuantite < mouvement.getQuantite()) {
                throw new RuntimeException("Stock insuffisant pour cette sortie");
            }
            nouvelleQuantite -= mouvement.getQuantite();
        } else if (mouvement.getType() == TypeMouvement.CORRECTION) {
            // Dans le cas d'une correction, la quantité indiquée devient la nouvelle quantité
            nouvelleQuantite = mouvement.getQuantite();
        }

        produit.setQuantiteStock(nouvelleQuantite);
        produitRepository.save(produit);

        return produitMapper.toMouvementDto(mouvementRepository.save(mouvement));
    }
}
