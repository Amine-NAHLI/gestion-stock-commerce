package com.gestionstock.backend.entity.enums;

/**
 * Statut d'une commande passée à un fournisseur
 * - EN_ATTENTE : Commande créée mais pas encore confirmée
 * - CONFIRMEE  : Commande validée par le fournisseur
 * - LIVREE     : Marchandise reçue, stock mis à jour
 * - ANNULEE    : Commande annulée
 */
public enum StatutCommande {
    EN_ATTENTE,
    CONFIRMEE,
    LIVREE,
    ANNULEE
}