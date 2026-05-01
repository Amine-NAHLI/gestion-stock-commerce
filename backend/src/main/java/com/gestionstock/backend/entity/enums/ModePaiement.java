package com.gestionstock.backend.entity.enums;

/**
 * Mode de paiement utilisé pour une vente
 * - ESPECES : Paiement en cash
 * - CARTE   : Paiement par carte bancaire
 * - CHEQUE  : Paiement par chèque
 */
public enum ModePaiement {
    ESPECES,
    CARTE,
    CHEQUE
}