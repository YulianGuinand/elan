// Ce composant est remplacé par les filtres inline dans Surveys.tsx
// Il est conservé pour ne pas casser d'éventuelles autres références
import { SurveyFilters } from "@/types/surveys";

interface FilterBarProps {
    filters: SurveyFilters;
    onFiltersChange: (filters: SurveyFilters) => void;
}

export default function FilterBar({
    filters,
    onFiltersChange,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-3">
            <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) =>
                    onFiltersChange({ ...filters, search: e.target.value })
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
                value={filters.statut}
                onChange={(e) =>
                    onFiltersChange({
                        ...filters,
                        statut: e.target.value as SurveyFilters["statut"],
                    })
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
                <option value="all">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="terminee">Terminée</option>
                <option value="a_venir">À venir</option>
                <option value="brouillon">Brouillon</option>
            </select>
        </div>
    );
}
