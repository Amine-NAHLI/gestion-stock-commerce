package com.gestionstock.backend.entity.enums;

/**
 * Type de mouvement de stock
 * - ENTREE : Augmentation du stock (réception commande, retour client, etc.)
 * - SORTIE : Diminution du stock (vente, casse, perte, etc.)
 * - AJUSTEMENT : Correction manuelle du stock (inventaire)
 */
public enum TypeMouvement {
    ENTREE,
    SORTIE,
    AJUSTEMENT
}