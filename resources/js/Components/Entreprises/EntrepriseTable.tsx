import { Building2, Mail, MapPin, Phone, Users } from "lucide-react";

interface Entreprise {
    id: number;
    raison_sociale: string | null;
    mail: string;
    telephone: string | null;
    ville: string | null;
    interlocuteur: string | null;
    created_at: string;
}

interface EntrepriseTableProps {
    entreprises: Entreprise[];
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

export default function EntrepriseTable({ entreprises }: EntrepriseTableProps) {
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
            {/* En-tête du tableau */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-semibold text-gray-800">
                        Entreprises enregistrées
                    </h3>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                        {entreprises.length}
                    </span>
                </div>
            </div>

            {/* Tableau desktop */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Entreprise
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Coordonnées
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Localisation
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Ajoutée le
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entreprises.map((e) => (
                            <tr
                                key={e.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
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
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{e.interlocuteur ?? "—"}</span>
                                    </div>
                                </td>

                                {/* Coordonnées */}
                                <td className="px-4 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="truncate max-w-[160px]">
                                                {e.mail}
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

                                {/* Localisation */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>{e.ville ?? "—"}</span>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            e.created_at,
                                        ).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
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
