import { SurveyItem } from "@/types/dashboard";
import { FileText } from "lucide-react";

interface ActiveSurveyTableProps {
    surveys: SurveyItem[];
}

export default function ActiveSurveyTable({ surveys }: ActiveSurveyTableProps) {
    const statusColors = {
        active: "bg-green-100 text-green-700",
        closed: "bg-gray-100 text-gray-700",
        draft: "bg-yellow-100 text-yellow-700",
    };

    const statusLabels = {
        active: "Active",
        closed: "Fermée",
        draft: "Brouillon",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Enquêtes Actives & Alertes
                </h3>
                <a
                    href="#"
                    className="text-sm font-medium text-elan-orange hover:text-elan-blue transition-colors"
                >
                    Voir Tout
                </a>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom de l'Enquête
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date de Fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {surveys.map((survey) => (
                            <tr
                                key={survey.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-elan-orange/10 rounded-lg">
                                            <FileText className="w-5 h-5 text-elan-orange" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {survey.name}
                                            </div>
                                            {survey.subtitle && (
                                                <div className="text-xs text-gray-500">
                                                    {survey.subtitle}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {survey.endDate}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                            statusColors[survey.status]
                                        }`}
                                    >
                                        {statusLabels[survey.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
