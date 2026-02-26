import { Survey } from "@/types/surveys";
import {
    Building2,
    Edit,
    Eye,
    GraduationCap,
    Trash2,
    User,
    Users,
} from "lucide-react";

interface SurveyTableProps {
    surveys: Survey[];
}

const audienceIcons = {
    apprentis: GraduationCap,
    entreprises: Building2,
    formateurs: User,
    tous: Users,
};

const audienceLabels = {
    apprentis: "Apprentis",
    entreprises: "Entreprises",
    formateurs: "Formateurs",
    tous: "Tous",
};

const statusConfig = {
    active: {
        label: "Active",
        class: "bg-green-100 text-green-700",
        dotClass: "bg-green-500",
    },
    draft: {
        label: "Brouillon",
        class: "bg-orange-100 text-orange-700",
        dotClass: "bg-orange-500",
    },
    completed: {
        label: "Terminée",
        class: "bg-gray-100 text-gray-700",
        dotClass: "bg-gray-500",
    },
};

export default function SurveyTable({ surveys }: SurveyTableProps) {
    if (surveys.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">Aucune enquête trouvée</p>
                <p className="text-gray-400 text-sm mt-2">
                    Essayez de modifier vos filtres
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Titre de l'enquête
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Audience
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Participation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {surveys.map((survey) => {
                            const AudienceIcon = audienceIcons[survey.audience];
                            const statusInfo = statusConfig[survey.status];

                            return (
                                <tr
                                    key={survey.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Titre */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {survey.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {survey.subtitle}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                ID: {survey.idNumber}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Audience */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <AudienceIcon className="w-5 h-5 text-gray-500" />
                                            <span className="text-sm text-gray-700">
                                                {
                                                    audienceLabels[
                                                        survey.audience
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    {/* Statut */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                                            />
                                            {statusInfo.label}
                                        </span>
                                    </td>

                                    {/* Dates */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700">
                                            {survey.endDate ? (
                                                <>
                                                    <p className="font-medium">
                                                        Du {survey.createdDate}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        Au {survey.endDate}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>
                                                    Créé le {survey.createdDate}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Participation */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {
                                                        survey.participation
                                                            .percentage
                                                    }
                                                    %
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {
                                                        survey.participation
                                                            .current
                                                    }
                                                    /
                                                    {survey.participation.total}
                                                </span>
                                            </div>
                                            <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-elan-orange transition-all duration-300"
                                                    style={{
                                                        width: `${survey.participation.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Voir"
                                            >
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
