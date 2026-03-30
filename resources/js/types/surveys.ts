// Champs réels depuis la base de données (table enquetes)
export type StatutEnquete = "active" | "terminee" | "a_venir" | "brouillon";

export interface Choix {
    id: number;
    libelle: string;
}

export interface ThemeEnquete {
    id: number;
    libelle: string;
    ordre: number;
    questions: QuestionEnquete[];
}

export interface QuestionEnquete {
    id: number;
    libelle: string;
    numero: number;
    type_reponse: string | null;
    type_reponse_id: number;
    theme?: {
        id: number;
        libelle: string;
        ordre: number;
    } | null;
    choix: Choix[];
    required?: boolean;
}

export interface ThemeEnquete {
    id: number;
    libelle: string;
    ordre: number;
    questions: QuestionEnquete[];
}

export interface Survey {
    id: number;
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    type_campagne: string;
    statut: StatutEnquete;
    utilisateur: string;
    utilisateur_id: number;
    nb_questions: number;
    questions: QuestionEnquete[];
    themes?: ThemeEnquete[];
    created_at: string;
}

export interface SurveyStats {
    total: number;
    active: number;
    terminee: number;
    a_venir: number;
}

export interface SurveyFilters {
    search: string;
    statut: StatutEnquete | "all";
    type_campagne: string;
    auteur: number | "all";
    date_debut: string;
    date_fin: string;
}

export interface TypeReponse {
    id: number;
    libelle: string;
}
// End of types
