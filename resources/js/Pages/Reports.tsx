import FadeIn from "@/Components/Animations/FadeIn";
import DonutChart from "@/Components/Reports/DonutChart";
import LineChart from "@/Components/Reports/LineChart";
import ReportFilterBar from "@/Components/Reports/ReportFilterBar";
import ReportKPICard from "@/Components/Reports/ReportKPICard";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    ChartDataPoint,
    DonutChartSegment,
    ReportFilters,
    ReportKPI,
} from "@/types/reports";
import { Head } from "@inertiajs/react";
import { Download, FileText } from "lucide-react";
import { useState } from "react";

interface ReportsProps {
    kpis: ReportKPI[];
    satisfactionEvolution: ChartDataPoint[];
    audienceDistribution: DonutChartSegment[];
}

export default function Reports({
    kpis,
    satisfactionEvolution,
    audienceDistribution,
}: ReportsProps) {
    const [filters, setFilters] = useState<ReportFilters>({
        period: "30days",
        survey: "all",
        audience: "all",
        indicator: "overview",
    });

    return (
        <>
            <Head title="Rapports Analytiques" />

            <DashboardLayout
                title="Rapports Analytiques"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Rapports" },
                ]}
            >
                <div className="space-y-6">
                    {/* En-tête avec description et boutons d'export */}
                    <FadeIn delay={0}>
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-gray-600 mt-1 max-w-2xl">
                                    Visualisez et analysez les performances de
                                    vos enquêtes de satisfaction, les taux de
                                    retour et l'engagement des apprenants.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <Download className="w-4 h-4" />
                                    CSV
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-elan-orange rounded-lg text-sm font-medium text-white hover:bg-elan-orange/90 transition-colors">
                                    <FileText className="w-4 h-4" />
                                    Exporter PDF
                                </button>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Barre de filtres */}
                    <FadeIn delay={100}>
                        <ReportFilterBar
                            filters={filters}
                            onFiltersChange={setFilters}
                        />
                    </FadeIn>

                    {/* Cartes KPI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpis.map((kpi, index) => (
                            <FadeIn key={kpi.id} delay={150 + index * 50}>
                                <ReportKPICard kpi={kpi} />
                            </FadeIn>
                        ))}
                    </div>

                    {/* Graphiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Évolution de la Satisfaction */}
                        <FadeIn delay={350}>
                            <LineChart
                                data={satisfactionEvolution}
                                title="Évolution de la Satisfaction (6 mois)"
                                detailsLink={() =>
                                    console.log("Afficher les détails")
                                }
                            />
                        </FadeIn>

                        {/* Répartition par Public */}
                        <FadeIn delay={400}>
                            <DonutChart
                                data={audienceDistribution}
                                title="Répartition par Public"
                                totalLabel="Réponses"
                            />
                        </FadeIn>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
