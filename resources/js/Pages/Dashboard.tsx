import FadeIn from "@/Components/Animations/FadeIn";
import ActiveSurveyTable from "@/Components/Dashboard/ActiveSurveyTable";
import CircularProgress from "@/Components/Dashboard/CircularProgress";
import ProgressBar from "@/Components/Dashboard/ProgressBar";
import StatsCard from "@/Components/Dashboard/StatsCard";
import WelcomeBanner from "@/Components/Dashboard/WelcomeBanner";
import PageHead from "@/Components/Seo/PageHead";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    ParticipationData,
    SatisfactionData,
    StatCard,
    SurveyItem,
} from "@/types/dashboard";
import { router } from "@inertiajs/react";

interface DashboardProps {
    stats: StatCard[];
    participationData: ParticipationData;
    satisfactionData: SatisfactionData;
    activeSurveys: SurveyItem[];
    userName: string;
    tauxParticipation: number;
}

export default function Dashboard({
    stats,
    participationData,
    satisfactionData,
    activeSurveys,
    userName,
    tauxParticipation,
}: DashboardProps) {
    return (
        <>
            <PageHead
                title="Tableau de Bord"
                description="Suivi en temps réel de vos enquêtes CFA et statistiques d'insertion. Performance, participation et conformité Qualiopi."
            />

            <DashboardLayout
                title="Performance des Enquêtes"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Vue d'ensemble" },
                ]}
                actionButton={{
                    label: "Créer une enquête",
                    onClick: () => router.get(route("surveys.create")),
                }}
            >
                <div className="space-y-6 w-full">
                    {/* Welcome Banner */}
                    <FadeIn delay={0}>
                        <WelcomeBanner
                            userName={userName}
                            message={
                                tauxParticipation > 50
                                    ? `Vos enquêtes sont performantes. Le taux de réponse moyen est de ${tauxParticipation}%.`
                                    : `Le taux de réponse est de ${tauxParticipation}%.`
                            }
                        />
                    </FadeIn>

                    {/* Stats Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <FadeIn
                                key={stat.id}
                                delay={100 + index * 50}
                                className="h-full"
                            >
                                <StatsCard stat={stat} />
                            </FadeIn>
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="gap-6">
                        {/* Satisfaction Card */}
                        <FadeIn delay={300}>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Satisfaction Globale
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        30 derniers jours
                                    </span>
                                </div>

                                <div className="mb-6 flex justify-center">
                                    <CircularProgress
                                        percentage={
                                            (satisfactionData.score /
                                                satisfactionData.maxScore) *
                                            100
                                        }
                                        title=""
                                        showScore
                                        score={satisfactionData.score}
                                        maxScore={satisfactionData.maxScore}
                                        size={140}
                                    />
                                </div>

                                <div className="space-y-2">
                                    {satisfactionData.levels.map(
                                        (level, index) => (
                                            <ProgressBar
                                                key={index}
                                                label={level.label}
                                                percentage={level.percentage}
                                                color={level.color}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Active Surveys Table */}
                    <FadeIn delay={350}>
                        <ActiveSurveyTable surveys={activeSurveys} />
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
