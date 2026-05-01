\# 📊 Modèle Conceptuel de Données (MCD)



\## Projet : Gestion de Stock pour Commerce de Proximité



\---



\## 📋 Liste des entités (11)



\### Module Authentification

1\. \*\*User\*\* - Utilisateurs de l'application

2\. \*\*Role\*\* - Rôles (ADMIN, GERANT, EMPLOYE)



\### Module Produits \& Stock

3\. \*\*Categorie\*\* - Catégories de produits

4\. \*\*Produit\*\* - Articles vendus

5\. \*\*MouvementStock\*\* - Historique entrées/sorties



\### Module Fournisseurs \& Commandes

6\. \*\*Fournisseur\*\* - Fournisseurs de marchandises

7\. \*\*Commande\*\* - Commandes passées aux fournisseurs

8\. \*\*LigneCommande\*\* - Détails des commandes



\### Module Ventes \& Clients

9\. \*\*Client\*\* - Clients de la boutique

10\. \*\*Vente\*\* - Ventes effectuées

11\. \*\*LigneVente\*\* - Détails des ventes



\---



\## 🔗 Relations principales



| Relation | Cardinalité |

|----------|-------------|

| User ↔ Role | N..1 |

| Produit ↔ Categorie | N..1 |

| Produit ↔ Fournisseur | N..1 |

| Commande ↔ Fournisseur | N..1 |

| Commande ↔ LigneCommande | 1..N |

| LigneCommande ↔ Produit | N..1 |

| Vente ↔ Client | N..1 |

| Vente ↔ LigneVente | 1..N |

| LigneVente ↔ Produit | N..1 |

| MouvementStock ↔ Produit | N..1 |

| MouvementStock ↔ User | N..1 |



\---



\## 📐 Description détaillée des entités



\### 1. User

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK, auto-increment |

| username | String | UNIQUE, NOT NULL |

| email | String | UNIQUE, NOT NULL |

| password | String | NOT NULL (BCrypt) |

| nomComplet | String | - |

| actif | Boolean | DEFAULT TRUE |

| dateCreation | LocalDateTime | - |

| role\_id | Long | FK → Role |



\### 2. Role

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| nom | String | UNIQUE (ADMIN, GERANT, EMPLOYE) |

| description | String | - |



\### 3. Categorie

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| nom | String | UNIQUE, NOT NULL |

| description | String | - |

| dateCreation | LocalDateTime | - |



\### 4. Produit

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| code | String | UNIQUE |

| nom | String | NOT NULL |

| description | String | - |

| prixAchat | Double | - |

| prixVente | Double | - |

| quantiteStock | Integer | DEFAULT 0 |

| seuilAlerte | Integer | - |

| unite | String | - |

| image | String | - |

| dateCreation | LocalDateTime | - |

| dateModification | LocalDateTime | - |

| categorie\_id | Long | FK → Categorie |

| fournisseur\_id | Long | FK → Fournisseur |



\### 5. MouvementStock

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| typeMouvement | Enum | ENTREE, SORTIE, AJUSTEMENT |

| quantite | Integer | NOT NULL |

| motif | String | - |

| dateMouvement | LocalDateTime | - |

| produit\_id | Long | FK → Produit |

| user\_id | Long | FK → User |



\### 6. Fournisseur

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| nom | String | NOT NULL |

| email | String | - |

| telephone | String | - |

| adresse | String | - |

| ville | String | - |

| pays | String | - |

| dateCreation | LocalDateTime | - |



\### 7. Commande

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| numero | String | UNIQUE |

| dateCommande | LocalDateTime | - |

| dateLivraison | LocalDateTime | - |

| statut | Enum | EN\_ATTENTE, CONFIRMEE, LIVREE, ANNULEE |

| montantTotal | Double | - |

| fournisseur\_id | Long | FK → Fournisseur |

| user\_id | Long | FK → User |



\### 8. LigneCommande

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| quantite | Integer | - |

| prixUnitaire | Double | - |

| sousTotal | Double | - |

| commande\_id | Long | FK → Commande |

| produit\_id | Long | FK → Produit |



\### 9. Client

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| nom | String | - |

| prenom | String | - |

| email | String | - |

| telephone | String | - |

| adresse | String | - |

| dateCreation | LocalDateTime | - |



\### 10. Vente

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| numero | String | UNIQUE |

| dateVente | LocalDateTime | - |

| montantTotal | Double | - |

| modePaiement | Enum | ESPECES, CARTE, CHEQUE |

| client\_id | Long | FK → Client (nullable) |

| user\_id | Long | FK → User |



\### 11. LigneVente

| Attribut | Type | Contraintes |

|----------|------|-------------|

| id | Long | PK |

| quantite | Integer | - |

| prixUnitaire | Double | - |

| sousTotal | Double | - |

| vente\_id | Long | FK → Vente |

| produit\_id | Long | FK → Produit |



\---



\## 📌 Notes importantes



\- Toutes les dates utilisent `LocalDateTime` (Java 8+)

\- Les mots de passe sont \*\*encodés en BCrypt\*\* (Spring Security)

\- Les enums sont stockés en `String` dans la BDD pour la lisibilité

\- `client\_id` dans Vente peut être NULL (client occasionnel sans inscription)

\- Les `montantTotal` sont calculés automatiquement à partir des lignes



\---



\## 🎯 Répartition équipe



\- \*\*Amine\*\* : Module Auth (User, Role) + Dashboard

\- \*\*Adnane\*\* : Module Produits (Produit, Categorie, MouvementStock)

\- \*\*Kenza\*\* : Module Fournisseurs/Ventes (Fournisseur, Commande, LigneCommande, Client, Vente, LigneVente)

