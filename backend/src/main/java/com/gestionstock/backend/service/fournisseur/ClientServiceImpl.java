package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.ClientDTO;
import com.gestionstock.backend.dto.fournisseur.FournisseurMapper;
import com.gestionstock.backend.entity.fournisseur.Client;
import com.gestionstock.backend.repository.fournisseur.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implémentation du service Client.
 * Gère la logique métier pour les opérations CRUD sur les clients.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final FournisseurMapper fournisseurMapper;

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(fournisseurMapper::toClientDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClientDTO getClientById(Long id) {
        return clientRepository.findById(id)
                .map(fournisseurMapper::toClientDto)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
    }

    @Override
    public List<ClientDTO> searchClients(String search) {
        return clientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(search, search).stream()
                .map(fournisseurMapper::toClientDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        if (clientDTO == null) {
            throw new IllegalArgumentException("Le client ne peut pas être null");
        }
        Client client = fournisseurMapper.toClientEntity(clientDTO);
        return fournisseurMapper.toClientDto(clientRepository.save(client));
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        if (id == null) {
            throw new IllegalArgumentException("L'identifiant du client est requis");
        }
        if (clientDTO == null) {
            throw new IllegalArgumentException("Le client ne peut pas être null");
        }

        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));

        existing.setNom(clientDTO.getNom());
        existing.setPrenom(clientDTO.getPrenom());
        existing.setEmail(clientDTO.getEmail());
        existing.setTelephone(clientDTO.getTelephone());
        existing.setAdresse(clientDTO.getAdresse());

        return fournisseurMapper.toClientDto(clientRepository.save(existing));
    }

    @Override
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client non trouvé avec l'id : " + id);
        }
        clientRepository.deleteById(id);
    }
}
