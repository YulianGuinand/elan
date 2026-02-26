export interface StatCard {
    id: string;
    title: string;
    value: string | number;
    change: number;
    changeText: string;
    icon: "send" | "response" | "alert";
    type?: "success" | "warning" | "info";
}

export interface SurveyItem {
    id: string;
    name: string;
    subtitle?: string;
    endDate: string;
    status: "active" | "closed" | "draft";
}

export interface SatisfactionLevel {
    label: string;
    percentage: number;
    color: string;
}

export interface ParticipationData {
    percentage: number;
    channelName: string;
    channelSubtitle: string;
}

export interface SatisfactionData {
    score: number;
    maxScore: number;
    levels: SatisfactionLevel[];
}
