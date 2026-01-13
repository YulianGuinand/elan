import ActiveSurveyTable from "@/Components/Dashboard/ActiveSurveyTable";
import CircularProgress from "@/Components/Dashboard/CircularProgress";
import ProgressBar from "@/Components/Dashboard/ProgressBar";
import StatsCard from "@/Components/Dashboard/StatsCard";
import WelcomeBanner from "@/Components/Dashboard/WelcomeBanner";
import {
    activeSurveys,
    participationData,
    satisfactionData,
    statsData,
} from "@/data/mockData";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function Overview() {
    return (
        <>
            <Head title="Performance des Enquêtes" />

            <DashboardLayout
                title="Performance des Enquêtes"
                breadcrumbs={[
                    { label: "Accueil", href: "/dashboard" },
                    { label: "Vue d'ensemble" },
                ]}
                actionButton={{
                    label: "Créer une enquête",
                    onClick: () => console.log("Create survey clicked"),
                }}
            >
                <div className="space-y-6">
                    {/* Welcome Banner */}
                    <WelcomeBanner
                        userName="Jean"
                        message="Vos enquêtes sont performantes. Les taux de réponse ont augmenté de 12% par rapport au mois dernier."
                    />

                    {/* Stats Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statsData.map((stat) => (
                            <StatsCard key={stat.id} stat={stat} />
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Participation Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Participation en Temps Réel
                            </h3>
                            <CircularProgress
                                percentage={participationData.percentage}
                                title={participationData.channelName}
                                subtitle={participationData.channelSubtitle}
                            />
                        </div>

                        {/* Satisfaction Card */}
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
                                {satisfactionData.levels.map((level, index) => (
                                    <ProgressBar
                                        key={index}
                                        label={level.label}
                                        percentage={level.percentage}
                                        color={level.color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Surveys Table */}
                    <ActiveSurveyTable surveys={activeSurveys} />
                </div>
            </DashboardLayout>
        </>
    );
}
