import { AudienceType, SurveyFilters, SurveyStatus } from "@/types/surveys";
import { Search } from "lucide-react";

interface FilterBarProps {
    filters: SurveyFilters;
    onFiltersChange: (filters: SurveyFilters) => void;
}

export default function FilterBar({
    filters,
    onFiltersChange,
}: FilterBarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({
            ...filters,
            status: e.target.value as SurveyStatus | "all",
        });
    };

    const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({
            ...filters,
            audience: e.target.value as AudienceType | "all",
        });
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({
            ...filters,
            period: e.target.value as SurveyFilters["period"],
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Champ de recherche */}
                <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Rechercher par titre..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Filtre Statuts */}
                <div>
                    <select
                        value={filters.status}
                        onChange={handleStatusChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Active</option>
                        <option value="draft">Brouillon</option>
                        <option value="completed">Terminée</option>
                    </select>
                </div>

                {/* Filtre Audiences */}
                <div>
                    <select
                        value={filters.audience}
                        onChange={handleAudienceChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="all">Toutes les audiences</option>
                        <option value="apprentis">Apprentis</option>
                        <option value="entreprises">Entreprises</option>
                        <option value="formateurs">Formateurs</option>
                        <option value="tous">Tous</option>
                    </select>
                </div>

                {/* Filtre Période */}
                <div>
                    <select
                        value={filters.period}
                        onChange={handlePeriodChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="all">Toutes les périodes</option>
                        <option value="7days">7 derniers jours</option>
                        <option value="30days">30 derniers jours</option>
                        <option value="90days">90 derniers jours</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
