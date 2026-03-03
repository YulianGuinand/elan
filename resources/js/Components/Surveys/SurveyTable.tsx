import { StatutEnquete, Survey } from "@/types/surveys";
import { router } from "@inertiajs/react";
import { Calendar, Edit, FileText, Send, Trash2 } from "lucide-react";

interface SurveyTableProps {
    surveys: Survey[];
    userRole?: string;
    userId?: number;
}

const statutConfig: Record<
    StatutEnquete,
    { label: string; cls: string; dot: string }
> = {
    active: {
        label: "Active",
        cls: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    terminee: {
        label: "Terminée",
        cls: "bg-gray-100 text-gray-600",
        dot: "bg-gray-400",
    },
    a_venir: {
        label: "À venir",
        cls: "bg-blue-100 text-blue-600",
        dot: "bg-blue-400",
    },
    brouillon: {
        label: "Brouillon",
        cls: "bg-orange-100 text-orange-700",
        dot: "bg-orange-400",
    },
};

export default function SurveyTable({
    surveys,
    userRole,
    userId,
}: SurveyTableProps) {
    if (surveys.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                    Aucune enquête trouvée
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Essayez de modifier vos filtres ou créez une nouvelle
                    enquête.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {[
                                "Enquête",
                                "Type",
                                "Statut",
                                "Période",
                                "Questions",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {surveys.map((survey) => {
                            const cfg =
                                statutConfig[survey.statut] ??
                                statutConfig.brouillon;

                            const canEdit =
                                userRole === "superadmin" ||
                                (userRole === "admin" &&
                                    survey.utilisateur_id === userId);

                            return (
                                <tr
                                    key={survey.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Titre */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                            {survey.titre}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                            {survey.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Par {survey.utilisateur}
                                        </p>
                                    </td>

                                    {/* Type campagne */}
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-gray-700">
                                            {survey.type_campagne}
                                        </span>
                                    </td>

                                    {/* Statut */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                            />
                                            {cfg.label}
                                        </span>
                                    </td>

                                    {/* Période */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            <span>
                                                {survey.date_debut} →{" "}
                                                {survey.date_fin}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Questions */}
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                                            {survey.nb_questions}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            {/* Remplir */}
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        route("surveys.fill", {
                                                            id: survey.id,
                                                        }),
                                                    )
                                                }
                                                className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
                                                title="Remplir l'enquête"
                                            >
                                                <Send className="w-4 h-4 text-orange-500" />
                                            </button>

                                            {/* Modifier */}
                                            {canEdit && (
                                                <button
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "surveys.edit",
                                                                {
                                                                    id: survey.id,
                                                                },
                                                            ),
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                </button>
                                            )}

                                            {/* Supprimer */}
                                            {canEdit && (
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                `Supprimer "${survey.titre}" ?`,
                                                            )
                                                        ) {
                                                            router.delete(
                                                                route(
                                                                    "surveys.destroy",
                                                                    {
                                                                        id: survey.id,
                                                                    },
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
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
