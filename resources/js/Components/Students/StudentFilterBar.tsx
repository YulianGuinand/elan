import { ProgramType, StudentFilters, StudentStatus } from "@/types/students";
import { Filter, Search } from "lucide-react";

interface StudentFilterBarProps {
    filters: StudentFilters;
    onFiltersChange: (filters: StudentFilters) => void;
}

export default function StudentFilterBar({
    filters,
    onFiltersChange,
}: StudentFilterBarProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Champ de recherche */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Rechercher par nom, prénom ou email..."
                            value={filters.search}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    {/* Filtre Programme */}
                    <div className="min-w-[200px]">
                        <select
                            value={filters.program}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    program: e.target.value as
                                        | ProgramType
                                        | "all",
                                })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="all">Programme</option>
                            <option value="web_dev">Développeur Web</option>
                            <option value="cybersecurity">Cybersécurité</option>
                            <option value="data_analyst">Data Analyst</option>
                            <option value="mobile_dev">
                                Développeur Mobile
                            </option>
                            <option value="ux_ui">UX/UI Design</option>
                        </select>
                    </div>

                    {/* Filtre Statut */}
                    <div className="min-w-[180px]">
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    status: e.target.value as
                                        | StudentStatus
                                        | "all",
                                })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white appearance-none"
                        >
                            <option value="all">Statut</option>
                            <option value="active">Actif</option>
                            <option value="graduated">Diplômé</option>
                            <option value="paused">En Pause</option>
                            <option value="suspended">Suspendu</option>
                        </select>
                    </div>

                    {/* Bouton de réinitialisation */}
                    {(filters.search ||
                        filters.program !== "all" ||
                        filters.status !== "all") && (
                        <button
                            onClick={() =>
                                onFiltersChange({
                                    search: "",
                                    program: "all",
                                    status: "all",
                                })
                            }
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
