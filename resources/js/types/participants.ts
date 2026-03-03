export interface Participant {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
    telephone: string;
    role: "Apprenti" | "Alumni" | "Formateur" | "Employeur" | string;
    created_at?: string;
    updated_at?: string;
    entreprises?: Entreprise[];
    contrats?: Contrat[];
}

export interface Entreprise {
    id: number;
    raison_sociale: string;
}

export interface Ecole {
    id: number;
    libelle: string;
}

export interface Formation {
    id: number;
    libelle: string;
}

export interface Contrat {
    id: number;
    formation_id: number;
    entreprise_id?: number;
    ecole_id?: number;
    formation?: Formation;
    entreprise?: Entreprise;
    ecole?: Ecole;
    date_entree?: string;
    date_sortiee?: string;
}

export interface PaginatedParticipants {
    data: Participant[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links?: any[];
}

export interface ParticipantFilters {
    search: string;
    program: string;
}
