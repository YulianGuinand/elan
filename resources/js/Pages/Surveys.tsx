import FilterBar from "@/Components/Surveys/FilterBar";
import Pagination from "@/Components/Surveys/Pagination";
import SurveyStatsCard from "@/Components/Surveys/SurveyStatsCard";
import SurveyTable from "@/Components/Surveys/SurveyTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Survey, SurveyFilters, SurveyStats } from "@/types/surveys";
import { Head } from "@inertiajs/react";
import { FileText, TrendingUp, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface SurveysProps {
    stats: SurveyStats;
    surveys: Survey[];
}

export default function Surveys({ stats, surveys }: SurveysProps) {
    const [filters, setFilters] = useState<SurveyFilters>({
        search: "",
        status: "all",
        audience: "all",
        period: "all",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredSurveys = useMemo(() => {
        return surveys.filter((survey) => {
            const matchesSearch =
                filters.search === "" ||
                survey.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                survey.subtitle
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                survey.idNumber
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());

            const matchesStatus =
                filters.status === "all" || survey.status === filters.status;

            const matchesAudience =
                filters.audience === "all" ||
                survey.audience === filters.audience;

            const matchesPeriod = filters.period === "all"; // TODO: implémenter la logique de date

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAudience &&
                matchesPeriod
            );
        });
    }, [surveys, filters]);

    const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
    const paginatedSurveys = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSurveys.slice(startIndex, endIndex);
    }, [filteredSurveys, currentPage]);

    const handleFiltersChange = (newFilters: SurveyFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="Gestion des Enquêtes" />

            <DashboardLayout
                title="Liste des Enquêtes"
                breadcrumbs={[
                    { label: "Accueil", href: "/dashboard" },
                    { label: "Enquêtes" },
                ]}
                actionButton={{
                    label: "Créer une enquête",
                    onClick: () => console.log("Créer enquête"),
                }}
            >
                <div className="space-y-6">
                    {/* Sous-titre */}
                    <p className="text-gray-600">
                        Gérez, suivez et analysez toutes vos enquêtes de
                        satisfaction et pédagogiques.
                    </p>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SurveyStatsCard
                            title="Total Enquêtes"
                            value={stats.total}
                            change={stats.totalChange}
                            icon={<FileText className="w-6 h-6" />}
                            iconBgColor="bg-orange-100"
                            iconColor="text-elan-orange"
                        />
                        <SurveyStatsCard
                            title="Enquêtes Actives"
                            value={stats.active}
                            icon={<Zap className="w-6 h-6" />}
                            iconBgColor="bg-amber-100"
                            iconColor="text-amber-600"
                        />
                        <SurveyStatsCard
                            title="Taux de Réponse Moyen"
                            value={`${stats.avgResponseRate}%`}
                            change={stats.avgResponseChange}
                            icon={<TrendingUp className="w-6 h-6" />}
                            iconBgColor="bg-orange-100"
                            iconColor="text-elan-orange"
                        />
                    </div>

                    {/* Barre de filtres */}
                    <FilterBar
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                    />

                    {/* Tableau des enquêtes */}
                    <SurveyTable surveys={paginatedSurveys} />

                    {/* Pagination */}
                    {filteredSurveys.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredSurveys.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
