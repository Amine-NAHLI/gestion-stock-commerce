package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.CommandeDTO;
import com.gestionstock.backend.dto.fournisseur.CommandeRequest;
import com.gestionstock.backend.dto.fournisseur.FournisseurMapper;
import com.gestionstock.backend.dto.fournisseur.LigneCommandeDTO;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.enums.StatutCommande;
import com.gestionstock.backend.entity.fournisseur.Commande;
import com.gestionstock.backend.entity.fournisseur.Fournisseur;
import com.gestionstock.backend.entity.fournisseur.LigneCommande;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.fournisseur.CommandeRepository;
import com.gestionstock.backend.repository.fournisseur.FournisseurRepository;
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
 * Implémentation du service Commande.
 * Gère la création de commandes multi-lignes, la mise à jour du statut,
 * et la mise à jour du stock lors de la livraison.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;
    private final FournisseurMapper fournisseurMapper;

    @Override
    public List<CommandeDTO> getAllCommandes() {
        return commandeRepository.findAllByOrderByDateCommandeDesc().stream()
                .map(fournisseurMapper::toCommandeDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommandeDTO getCommandeById(Long id) {
        return commandeRepository.findById(id)
                .map(fournisseurMapper::toCommandeDto)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'id : " + id));
    }

    @Override
    public List<CommandeDTO> getCommandesByFournisseur(Long fournisseurId) {
        return commandeRepository.findByFournisseurIdOrderByDateCommandeDesc(fournisseurId).stream()
                .map(fournisseurMapper::toCommandeDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommandeDTO> getCommandesByStatut(StatutCommande statut) {
        return commandeRepository.findByStatutOrderByDateCommandeDesc(statut).stream()
                .map(fournisseurMapper::toCommandeDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommandeDTO createCommande(CommandeRequest request) {
        if (request.getLignes() == null || request.getLignes().isEmpty()) {
            throw new RuntimeException("La commande doit contenir au moins une ligne");
        }

        // Récupérer le fournisseur
        Fournisseur fournisseur = fournisseurRepository.findById(request.getFournisseurId())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id : " + request.getFournisseurId()));

        // Récupérer l'utilisateur connecté
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + username));

        // Créer la commande
        Commande commande = new Commande();
        commande.setNumero(genererNumeroCommande());
        commande.setFournisseur(fournisseur);
        commande.setUser(user);
        commande.setStatut(StatutCommande.EN_ATTENTE);

        // Ajouter les lignes de commande
        double montantTotal = 0.0;
        for (LigneCommandeDTO ligneDto : request.getLignes()) {
            if (ligneDto.getQuantite() == null || ligneDto.getQuantite() <= 0) {
                throw new IllegalArgumentException("La quantité commandée doit être supérieure à zéro");
            }
            if (ligneDto.getPrixUnitaire() == null || ligneDto.getPrixUnitaire() < 0) {
                throw new IllegalArgumentException("Le prix unitaire ne peut pas être négatif");
            }

            Produit produit = produitRepository.findById(ligneDto.getProduitId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + ligneDto.getProduitId()));

            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(commande);
            ligne.setProduit(produit);
            ligne.setQuantite(ligneDto.getQuantite());
            ligne.setPrixUnitaire(ligneDto.getPrixUnitaire());
            ligne.setSousTotal(ligneDto.getQuantite() * ligneDto.getPrixUnitaire());

            commande.getLignes().add(ligne);
            montantTotal += ligne.getSousTotal();
        }

        commande.setMontantTotal(montantTotal);

        // Sauvegarder la commande (cascade sauvegarde les lignes)
        Commande saved = commandeRepository.save(commande);
        return fournisseurMapper.toCommandeDto(saved);
    }

    @Override
    public CommandeDTO updateStatut(Long id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'id : " + id));

        // Si la commande passe à LIVREE, mettre à jour le stock des produits
        if (statut == StatutCommande.LIVREE && commande.getStatut() != StatutCommande.LIVREE) {
            for (LigneCommande ligne : commande.getLignes()) {
                Produit produit = ligne.getProduit();
                produit.setQuantiteStock(produit.getQuantiteStock() + ligne.getQuantite());
                produitRepository.save(produit);
            }
            commande.setDateLivraison(LocalDateTime.now());
        } 
        // Si la commande était LIVREE et passe à un autre statut, on retire le stock ajouté précédemment
        else if (commande.getStatut() == StatutCommande.LIVREE && statut != StatutCommande.LIVREE) {
            for (LigneCommande ligne : commande.getLignes()) {
                Produit produit = ligne.getProduit();
                produit.setQuantiteStock(produit.getQuantiteStock() - ligne.getQuantite());
                produitRepository.save(produit);
            }
            commande.setDateLivraison(null);
        }

        commande.setStatut(statut);
        Commande saved = commandeRepository.save(commande);
        return fournisseurMapper.toCommandeDto(saved);
    }

    @Override
    public void deleteCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'id : " + id));

        // On ne peut supprimer que les commandes EN_ATTENTE
        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new RuntimeException("Impossible de supprimer une commande avec le statut : " + commande.getStatut());
        }

        commandeRepository.deleteById(id);
    }

    /**
     * Génère un numéro de commande unique au format CMD-YYYYMMDD-TIMESTAMP
     */
    private String genererNumeroCommande() {
        String prefix = "CMD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        return prefix + System.currentTimeMillis();
    }
}
