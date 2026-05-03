export enum TypeMouvement {
    ENTREE = 'ENTREE',
    SORTIE = 'SORTIE',
    CORRECTION = 'CORRECTION',
    RETOUR = 'RETOUR'
}

export interface MouvementStock {
    id?: number;
    produitId: number;
    produitNom?: string;
    produitCode?: string;
    quantite: number;
    type: TypeMouvement;
    motif?: string;
    dateMouvement?: string;
}
