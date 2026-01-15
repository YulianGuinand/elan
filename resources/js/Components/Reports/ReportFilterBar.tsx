import { ReportFilters } from "@/types/reports";
import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";

interface ReportFilterBarProps {
    filters: ReportFilters;
    onFiltersChange: (filters: ReportFilters) => void;
}

export default function ReportFilterBar({
    filters,
    onFiltersChange,
}: ReportFilterBarProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Période */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        Période
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filters.period}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    period: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="30days">Derniers 30 jours</option>
                            <option value="7days">7 derniers jours</option>
                            <option value="90days">90 derniers jours</option>
                            <option value="6months">6 derniers mois</option>
                            <option value="1year">1 an</option>
                        </select>
                    </div>
                </div>

                {/* Enquête */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        Enquête
                    </label>
                    <div className="relative">
                        <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filters.survey}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    survey: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="all">Toutes les enquêtes</option>
                            <option value="apprentis">Enquête Apprentis</option>
                            <option value="formateurs">
                                Enquête Formateurs
                            </option>
                            <option value="entreprises">
                                Enquête Entreprises
                            </option>
                        </select>
                    </div>
                </div>

                {/* Public Cible */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        Public Cible
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filters.audience}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    audience: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="all">Tous publics</option>
                            <option value="apprentis">Apprentis</option>
                            <option value="formateurs">Formateurs</option>
                            <option value="employeurs">Employeurs</option>
                        </select>
                    </div>
                </div>

                {/* Indicateur Clé (KPI) */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        Indicateur Clé (KPI)
                    </label>
                    <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filters.indicator}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    indicator: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="overview">Vue d'ensemble</option>
                            <option value="participation">
                                Taux de participation
                            </option>
                            <option value="satisfaction">
                                Satisfaction moyenne
                            </option>
                            <option value="responses">
                                Nombre de réponses
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
