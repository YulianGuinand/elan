import DropdownMenu, { DropdownItem } from "@/Components/Common/DropdownMenu";
import { StatutEnquete, Survey } from "@/types/surveys";
import { router } from "@inertiajs/react";
import {
    ArrowRight,
    Calendar,
    Copy,
    Edit,
    Eye,
    FileText,
    MoreVertical,
    Send,
    Trash2,
} from "lucide-react";
import { useState } from "react";

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
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelected(newSelected);
    };

    const toggleSelectAll = () => {
        if (selected.size === surveys.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(surveys.map((s) => s.id)));
        }
    };

    const handleDuplicate = (survey: Survey) => {
        if (confirm(`Dupliquer "${survey.titre}" ?`)) {
            router.post(route("surveys.duplicate", { id: survey.id }));
        }
    };

    const handleDelete = (survey: Survey) => {
        if (confirm(`Supprimer "${survey.titre}" ?`)) {
            router.delete(route("surveys.destroy", { id: survey.id }));
        }
    };

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
        <>
            {/* Barre d'actions rapides */}
            {selected.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <p className="text-sm text-blue-900 font-medium">
                        {selected.size} enquête{selected.size > 1 ? "s" : ""}{" "}
                        sélectionnée{selected.size > 1 ? "s" : ""}
                    </p>
                    <button
                        onClick={() => setSelected(new Set())}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Désélectionner tout
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selected.size === surveys.length &&
                                            surveys.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded cursor-pointer accent-orange-500"
                                    />
                                </th>
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
                            {surveys.map((survey, index) => {
                                const cfg =
                                    statutConfig[survey.statut] ??
                                    statutConfig.brouillon;

                                const canEdit =
                                    userRole === "superadmin" ||
                                    (userRole === "admin" &&
                                        survey.utilisateur_id === userId);

                                const isSelected = selected.has(survey.id);

                                return (
                                    <tr
                                        key={survey.id}
                                        className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                                    >
                                        <td className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleSelect(survey.id)
                                                }
                                                className="w-4 h-4 rounded cursor-pointer accent-orange-500"
                                            />
                                        </td>

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
                                                <span className="flex flex-row items-center gap-2">
                                                    {survey.date_debut}
                                                    <ArrowRight className="size-3.5" />
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

                                        {/* Actions Dropdown */}
                                        <td className="px-5 py-4">
                                            <DropdownMenu
                                                trigger={
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                                                    </button>
                                                }
                                                align="right"
                                                index={index}
                                            >
                                                <DropdownItem
                                                    icon={
                                                        <Send className="w-4 h-4" />
                                                    }
                                                    onClick={() => {
                                                        router.visit(
                                                            route(
                                                                "surveys.fill",
                                                                {
                                                                    id: survey.id,
                                                                },
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    Répondre
                                                </DropdownItem>

                                                {canEdit && (
                                                    <DropdownItem
                                                        icon={
                                                            <Edit className="w-4 h-4" />
                                                        }
                                                        onClick={() => {
                                                            router.visit(
                                                                route(
                                                                    "surveys.edit",
                                                                    {
                                                                        id: survey.id,
                                                                    },
                                                                ),
                                                            );
                                                        }}
                                                    >
                                                        Modifier
                                                    </DropdownItem>
                                                )}

                                                <DropdownItem
                                                    icon={
                                                        <Eye className="w-4 h-4" />
                                                    }
                                                    onClick={() => {
                                                        router.visit(
                                                            route(
                                                                "surveys.responses",
                                                                {
                                                                    id: survey.id,
                                                                },
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    Voir les réponses
                                                </DropdownItem>

                                                {canEdit && (
                                                    <DropdownItem
                                                        icon={
                                                            <Copy className="w-4 h-4" />
                                                        }
                                                        onClick={() => {
                                                            handleDuplicate(
                                                                survey,
                                                            );
                                                        }}
                                                    >
                                                        Dupliquer
                                                    </DropdownItem>
                                                )}

                                                {canEdit && (
                                                    <DropdownItem
                                                        icon={
                                                            <Trash2 className="w-4 h-4" />
                                                        }
                                                        onClick={() => {
                                                            handleDelete(
                                                                survey,
                                                            );
                                                        }}
                                                        danger
                                                    >
                                                        Supprimer
                                                    </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
