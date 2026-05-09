package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.FournisseurMapper;
import com.gestionstock.backend.dto.fournisseur.LigneVenteDTO;
import com.gestionstock.backend.dto.fournisseur.VenteDTO;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.enums.ModePaiement;
import com.gestionstock.backend.entity.fournisseur.Client;
import com.gestionstock.backend.entity.fournisseur.LigneVente;
import com.gestionstock.backend.entity.fournisseur.Vente;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.fournisseur.ClientRepository;
import com.gestionstock.backend.repository.fournisseur.VenteRepository;
import com.gestionstock.backend.repository.produit.ProduitRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implémentation du service Vente.
 * Gère la logique métier pour le point de vente :
 * création de ventes, déduction du stock, et génération de numéro.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class VenteServiceImpl implements VenteService {

    private final VenteRepository venteRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;
    private final FournisseurMapper fournisseurMapper;

    @Override
    public List<VenteDTO> getAllVentes() {
        return venteRepository.findAllByOrderByDateVenteDesc().stream()
                .map(fournisseurMapper::toVenteDto)
                .collect(Collectors.toList());
    }

    @Override
    public VenteDTO getVenteById(Long id) {
        return venteRepository.findById(id)
                .map(fournisseurMapper::toVenteDto)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée avec l'id : " + id));
    }

    @Override
    public List<VenteDTO> getVentesByClient(Long clientId) {
        return venteRepository.findByClientIdOrderByDateVenteDesc(clientId).stream()
                .map(fournisseurMapper::toVenteDto)
                .collect(Collectors.toList());
    }

    @Override
    public VenteDTO createVente(Long clientId, ModePaiement modePaiement, List<LigneVenteDTO> lignesDto) {
        if (lignesDto == null || lignesDto.isEmpty()) {
            throw new RuntimeException("La vente doit contenir au moins une ligne");
        }

        // Récupérer l'utilisateur connecté (le vendeur)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + username));

        // Créer la vente
        Vente vente = new Vente();
        vente.setNumero(genererNumeroVente());
        vente.setModePaiement(modePaiement != null ? modePaiement : ModePaiement.ESPECES);
        vente.setUser(user);

        // Associer le client (optionnel pour vente occasionnelle)
        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + clientId));
            vente.setClient(client);
        }

        // Ajouter les lignes de vente et déduire le stock
        double montantTotal = 0.0;
        for (LigneVenteDTO ligneDto : lignesDto) {
            Produit produit = produitRepository.findById(ligneDto.getProduitId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + ligneDto.getProduitId()));

            // Vérifier que le stock est suffisant
            if (produit.getQuantiteStock() < ligneDto.getQuantite()) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + produit.getNom()
                        + " (disponible: " + produit.getQuantiteStock() + ", demandé: " + ligneDto.getQuantite() + ")");
            }

            LigneVente ligne = new LigneVente();
            ligne.setVente(vente);
            ligne.setProduit(produit);
            ligne.setQuantite(ligneDto.getQuantite());
            ligne.setPrixUnitaire(ligneDto.getPrixUnitaire());
            ligne.setSousTotal(ligneDto.getQuantite() * ligneDto.getPrixUnitaire());

            vente.getLignes().add(ligne);
            montantTotal += ligne.getSousTotal();

            // Déduire le stock
            produit.setQuantiteStock(produit.getQuantiteStock() - ligneDto.getQuantite());
            produitRepository.save(produit);
        }

        vente.setMontantTotal(montantTotal);

        // Sauvegarder la vente (cascade sauvegarde les lignes)
        Vente saved = venteRepository.save(vente);
        return fournisseurMapper.toVenteDto(saved);
    }

    @Override
    public void deleteVente(Long id) {
        if (!venteRepository.existsById(id)) {
            throw new RuntimeException("Vente non trouvée avec l'id : " + id);
        }
        venteRepository.deleteById(id);
    }

    /**
     * Génère un numéro de vente unique au format VTE-YYYY-XXX
     */
    private String genererNumeroVente() {
        String prefix = "VTE-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-";
        long count = venteRepository.count() + 1;
        return prefix + String.format("%03d", count);
    }
}
