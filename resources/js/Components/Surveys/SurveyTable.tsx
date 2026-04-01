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
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });
    const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                !target.closest("[data-dropdown-id]") &&
                !target.closest("[role='menu']")
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                            {surveys.map((survey) => {
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
                                            <div data-dropdown-id={survey.id}>
                                                <button
                                                    ref={(el) => {
                                                        if (el) {
                                                            buttonRefs.current.set(
                                                                survey.id,
                                                                el,
                                                            );
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        const button =
                                                            e.currentTarget;
                                                        const rect =
                                                            button.getBoundingClientRect();
                                                        setDropdownPos({
                                                            x: rect.left,
                                                            y: rect.bottom + 5,
                                                        });
                                                        setOpenDropdown(
                                                            openDropdown ===
                                                                survey.id
                                                                ? null
                                                                : survey.id,
                                                        );
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Actions"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-600 hover:text-gray-900" />
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

            {/* Portal for Dropdown Menu */}
            {openDropdown !== null &&
                createPortal(
                    <div
                        className="fixed w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                        style={{
                            left: `${dropdownPos.x - 20}px`,
                            top: `${dropdownPos.y}px`,
                        }}
                        role="menu"
                    >
                        <button
                            onClick={() => {
                                router.visit(
                                    route("surveys.fill", {
                                        id: openDropdown,
                                    }),
                                );
                                setOpenDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center gap-2 border-b border-gray-100"
                        >
                            <Send className="w-4 h-4" />
                            Répondre
                        </button>

                        {surveys.find((s) => s.id === openDropdown)
                            ?.utilisateur_id === userId &&
                            userRole !== undefined && (
                                <button
                                    onClick={() => {
                                        router.visit(
                                            route("surveys.edit", {
                                                id: openDropdown,
                                            }),
                                        );
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                                >
                                    <Edit className="w-4 h-4" />
                                    Modifier
                                </button>
                            )}

                        <button
                            onClick={() => {
                                router.visit(
                                    route("surveys.responses", {
                                        id: openDropdown,
                                    }),
                                );
                                setOpenDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                        >
                            <Eye className="w-4 h-4" />
                            Voir les réponses
                        </button>

                        {surveys.find((s) => s.id === openDropdown)
                            ?.utilisateur_id === userId &&
                            userRole !== undefined && (
                                <button
                                    onClick={() => {
                                        const survey = surveys.find(
                                            (s) => s.id === openDropdown,
                                        );
                                        if (survey) {
                                            handleDuplicate(survey);
                                            setOpenDropdown(null);
                                        }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                                >
                                    <Copy className="w-4 h-4" />
                                    Dupliquer
                                </button>
                            )}

                        {surveys.find((s) => s.id === openDropdown)
                            ?.utilisateur_id === userId &&
                            userRole !== undefined && (
                                <button
                                    onClick={() => {
                                        const survey = surveys.find(
                                            (s) => s.id === openDropdown,
                                        );
                                        if (survey) {
                                            handleDelete(survey);
                                            setOpenDropdown(null);
                                        }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                </button>
                            )}
                    </div>,
                    document.body,
                )}
        </>
    );
}
