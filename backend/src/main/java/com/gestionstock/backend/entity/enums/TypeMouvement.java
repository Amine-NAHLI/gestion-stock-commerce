package com.gestionstock.backend.entity.enums;

/**
 * Type de mouvement de stock
 * - ENTREE : Augmentation du stock (réception commande, retour client, etc.)
 * - SORTIE : Diminution du stock (vente, casse, perte, etc.)
 * - RETOUR : Retour de produit (client ou fournisseur)
 * - CORRECTION : Correction manuelle du stock (inventaire, ajustement)
 */
public enum TypeMouvement {
    ENTREE,
    SORTIE,
    RETOUR,
    CORRECTION
}