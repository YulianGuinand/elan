export type ParticipantRole =
    | "apprenant"
    | "tuteur"
    | "formateur"
    | "employeur";

export interface Participant {
    id?: number;
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    role: ParticipantRole;
    programme_formation?: string;
    created_at?: string;
    statut?: "validé" | "en attente" | "refusé";
}

export interface CSVParseResult {
    data: Participant[];
    errors: CSVError[];
    meta: {
        fields?: string[];
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
    };
}

export interface CSVError {
    row: number;
    message: string;
    field?: string;
}

export interface RecentParticipant extends Participant {
    id: number;
    created_at: string;
    statut: "validé" | "en attente" | "refusé";
}
