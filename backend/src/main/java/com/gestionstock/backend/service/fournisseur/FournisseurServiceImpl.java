package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.FournisseurDTO;
import com.gestionstock.backend.dto.fournisseur.FournisseurMapper;
import com.gestionstock.backend.entity.fournisseur.Fournisseur;
import com.gestionstock.backend.repository.fournisseur.FournisseurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implémentation du service Fournisseur.
 * Gère la logique métier pour les opérations CRUD sur les fournisseurs.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;
    private final FournisseurMapper fournisseurMapper;

    @Override
    public List<FournisseurDTO> getAllFournisseurs() {
        return fournisseurRepository.findAll().stream()
                .map(fournisseurMapper::toFournisseurDto)
                .collect(Collectors.toList());
    }

    @Override
    public FournisseurDTO getFournisseurById(Long id) {
        return fournisseurRepository.findById(id)
                .map(fournisseurMapper::toFournisseurDto)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id : " + id));
    }

    @Override
    public List<FournisseurDTO> searchFournisseurs(String nom) {
        return fournisseurRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(fournisseurMapper::toFournisseurDto)
                .collect(Collectors.toList());
    }

    @Override
    public FournisseurDTO createFournisseur(FournisseurDTO fournisseurDTO) {
        Fournisseur fournisseur = fournisseurMapper.toFournisseurEntity(fournisseurDTO);
        return fournisseurMapper.toFournisseurDto(fournisseurRepository.save(fournisseur));
    }

    @Override
    public FournisseurDTO updateFournisseur(Long id, FournisseurDTO fournisseurDTO) {
        Fournisseur existing = fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id : " + id));

        existing.setNom(fournisseurDTO.getNom());
        existing.setEmail(fournisseurDTO.getEmail());
        existing.setTelephone(fournisseurDTO.getTelephone());
        existing.setAdresse(fournisseurDTO.getAdresse());
        existing.setVille(fournisseurDTO.getVille());
        existing.setPays(fournisseurDTO.getPays());

        return fournisseurMapper.toFournisseurDto(fournisseurRepository.save(existing));
    }

    @Override
    public void deleteFournisseur(Long id) {
        if (!fournisseurRepository.existsById(id)) {
            throw new RuntimeException("Fournisseur non trouvé avec l'id : " + id);
        }
        fournisseurRepository.deleteById(id);
    }
}
