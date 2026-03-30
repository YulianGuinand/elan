import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import { router } from "@inertiajs/react";
import {
    Building2,
    Edit,
    Eye,
    Mail,
    MapPin,
    MoreVertical,
    Phone,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";

interface Entreprise {
    id: number;
    raison_sociale: string | null;
    mail: string | null;
    telephone: string | null;
    ville: string | null;
    interlocuteur: string | null;
    created_at: string;
}

interface EntrepriseTableProps {
    entreprises: Entreprise[];
    totalCount?: number;
}

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function EntrepriseTable({
    entreprises,
    totalCount,
}: EntrepriseTableProps) {
    const [selected, setSelected] = useState<number[]>([]);

    const allSelected =
        selected.length === entreprises.length && entreprises.length > 0;
    const someSelected = selected.length > 0 && !allSelected;

    const toggleAll = () =>
        setSelected(allSelected ? [] : entreprises.map((e) => e.id));

    const toggleOne = (id: number) =>
        setSelected((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
        );

    const handleDelete = (id: number) => {
        if (!confirm("Supprimer cette entreprise ?")) return;
        router.delete(route("entreprises.destroy", id), {
            preserveScroll: true,
        });
    };

    const handleBulkDelete = () => {
        if (!confirm(`Supprimer ${selected.length} entreprise(s) ?`)) return;
        router.post(
            route("entreprises.bulk-destroy"),
            { ids: selected },
            { preserveScroll: true, onSuccess: () => setSelected([]) },
        );
    };

    if (entreprises.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Aucune entreprise enregistrée
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                    Ajoutez votre première entreprise via la saisie manuelle ou
                    en important un fichier CSV.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* En-tête */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-semibold text-gray-800">
                        Entreprises enregistrées
                    </h3>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                        {totalCount ?? entreprises.length}
                    </span>
                </div>

                {/* Bulk delete */}
                {selected.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer ({selected.length})
                    </button>
                )}
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            {/* Checkbox */}
                            <th className="w-10 px-2 sm:px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected;
                                    }}
                                    onChange={toggleAll}
                                    className="w-4 h-4 rounded border-gray-300 text-elan-orange focus:ring-elan-orange cursor-pointer"
                                />
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Entreprise
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Contact
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                Coordonnées
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                Ville
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entreprises.map((e) => (
                            <tr
                                key={e.id}
                                className={`hover:bg-gray-50 transition-colors ${selected.includes(e.id) ? "bg-orange-50/50" : ""}`}
                            >
                                {/* Checkbox */}
                                <td className="w-10 px-2 sm:px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(e.id)}
                                        onChange={() => toggleOne(e.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-elan-orange focus:ring-elan-orange cursor-pointer"
                                    />
                                </td>

                                {/* Entreprise */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-orange-600">
                                                {getInitials(e.raison_sociale)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {e.raison_sociale ?? "—"}
                                        </span>
                                    </div>
                                </td>

                                {/* Contact */}
                                <td className="px-4 py-4 hidden md:table-cell">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{e.interlocuteur ?? "—"}</span>
                                    </div>
                                </td>

                                {/* Coordonnées */}
                                <td className="px-4 py-4 hidden lg:table-cell">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="truncate max-w-[160px]">
                                                {e.mail ?? "—"}
                                            </span>
                                        </div>
                                        {e.telephone && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                <span>{e.telephone}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Ville */}
                                <td className="px-4 py-4 hidden lg:table-cell">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{e.ville ?? "—"}</span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4">
                                    <DropdownMenu
                                        trigger={
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        }
                                    >
                                        <DropdownItem
                                            icon={<Eye className="w-4 h-4" />}
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "entreprises.show",
                                                        e.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Voir
                                        </DropdownItem>
                                        <DropdownItem
                                            icon={<Edit className="w-4 h-4" />}
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "entreprises.edit",
                                                        e.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Modifier
                                        </DropdownItem>
                                        <DropdownDivider />
                                        <DropdownItem
                                            icon={
                                                <Trash2 className="w-4 h-4" />
                                            }
                                            onClick={() => handleDelete(e.id)}
                                            danger
                                        >
                                            Supprimer
                                        </DropdownItem>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
