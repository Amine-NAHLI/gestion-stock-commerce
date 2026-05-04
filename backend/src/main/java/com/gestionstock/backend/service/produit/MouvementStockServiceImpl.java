package com.gestionstock.backend.service.produit;

import com.gestionstock.backend.dto.produit.MouvementStockDTO;
import com.gestionstock.backend.dto.produit.ProduitMapper;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.produit.MouvementStock;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.entity.enums.TypeMouvement;
import com.gestionstock.backend.repository.auth.UserRepository;
import com.gestionstock.backend.repository.produit.MouvementStockRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
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
        if (mouvementDTO.getProduitId() == null) {
            throw new RuntimeException("L'ID du produit est obligatoire");
        }
        if (mouvementDTO.getQuantite() == null || mouvementDTO.getQuantite() <= 0) {
            throw new RuntimeException("La quantité du mouvement doit être supérieure à zéro");
        }
        if (mouvementDTO.getType() == null) {
            throw new RuntimeException("Le type de mouvement est obligatoire");
        }

        Produit produit = produitRepository.findById(mouvementDTO.getProduitId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Récupération de l'utilisateur actuel
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + username));

        MouvementStock mouvement = produitMapper.toMouvementEntity(mouvementDTO);
        mouvement.setProduit(produit);
        mouvement.setUser(user);

        // Mise à jour du stock réel du produit
        Double stockActuel = produit.getQuantiteStock() != null ? produit.getQuantiteStock() : 0.0;
        Double quantiteMouvement = mouvement.getQuantite();
        Double nouvelleQuantite = stockActuel;
        
        switch (mouvement.getType()) {
            case ENTREE:
            case RETOUR:
                nouvelleQuantite = stockActuel + quantiteMouvement;
                break;
            case SORTIE:
                if (stockActuel < quantiteMouvement) {
                    throw new RuntimeException("Stock insuffisant pour cette sortie (Stock actuel: " + stockActuel + ")");
                }
                nouvelleQuantite = stockActuel - quantiteMouvement;
                break;
            case CORRECTION:
                // Dans le cas d'une correction, la quantité indiquée devient la nouvelle quantité
                nouvelleQuantite = quantiteMouvement;
                break;
            default:
                throw new RuntimeException("Type de mouvement non supporté : " + mouvement.getType());
        }

        produit.setQuantiteStock(nouvelleQuantite);
        produitRepository.save(produit);

        return produitMapper.toMouvementDto(mouvementRepository.save(mouvement));
    }
}
