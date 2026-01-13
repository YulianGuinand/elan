// Ce fichier a été conservé mais les données sont maintenant dans le backend PHP
// Voir: app/Http/Controllers/DashboardController.php

import {
    ParticipationData,
    SatisfactionData,
    StatCard,
    SurveyItem,
} from "@/types/dashboard";

// Ces données ne sont plus utilisées - elles sont maintenant fournies par le backend
export const statsData: StatCard[] = [];
export const participationData: ParticipationData = {
    percentage: 0,
    channelName: "",
    channelSubtitle: "",
};
export const satisfactionData: SatisfactionData = {
    score: 0,
    maxScore: 5,
    levels: [],
};
export const activeSurveys: SurveyItem[] = [];
