export type SurveyStatus = "active" | "draft" | "completed";
export type AudienceType = "apprentis" | "entreprises" | "formateurs" | "tous";

export interface Survey {
    id: string;
    title: string;
    subtitle: string;
    idNumber: string;
    audience: AudienceType;
    status: SurveyStatus;
    createdDate: string;
    endDate?: string;
    participation: {
        percentage: number;
        current: number;
        total: number;
    };
}

export interface SurveyStats {
    total: number;
    totalChange: number;
    active: number;
    avgResponseRate: number;
    avgResponseChange: number;
}

export interface SurveyFilters {
    search: string;
    status: SurveyStatus | "all";
    audience: AudienceType | "all";
    period: "all" | "7days" | "30days" | "90days";
}
