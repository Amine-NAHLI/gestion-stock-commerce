package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.dto.fournisseur.ClientDTO;

import java.util.List;

/**
 * Interface du service Client.
 * Définit les opérations métier pour la gestion des clients.
 */
public interface ClientService {

    /** Récupère tous les clients */
    List<ClientDTO> getAllClients();

    /** Récupère un client par son identifiant */
    ClientDTO getClientById(Long id);

    /** Recherche les clients par nom ou prénom (recherche partielle) */
    List<ClientDTO> searchClients(String search);

    /** Crée un nouveau client */
    ClientDTO createClient(ClientDTO clientDTO);

    /** Met à jour un client existant */
    ClientDTO updateClient(Long id, ClientDTO clientDTO);

    /** Supprime un client par son identifiant */
    void deleteClient(Long id);
}
