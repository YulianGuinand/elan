import { Calendar, Users } from "lucide-react";

interface Contract {
    id: number;
    participant_nom: string;
    participant_prenom: string;
    participant_role: string;
    formation_libelle: string;
    entreprise_libelle: string;
    date_entree: string;
    date_sortiee: string | null;
}

interface ContractsTableProps {
    contracts: Contract[];
}

const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
};

const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
        case "apprentis":
            return "bg-blue-100 text-blue-800";
        case "formateurs":
            return "bg-purple-100 text-purple-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function ContractsTable({ contracts }: ContractsTableProps) {
    if (contracts.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-500 text-center px-4">
                    Aucun contrat actuallement pour cette école.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            Nom et Prénom
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            Rôle
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            Formation
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            Entreprise
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Date d'entrée
                            </span>
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 truncate">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Date de sortie
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map((contract, idx) => (
                        <tr
                            key={contract.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        >
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {contract.participant_prenom}{" "}
                                {contract.participant_nom}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                        contract.participant_role,
                                    )}`}
                                >
                                    <Users className="w-3 h-3" />
                                    {contract.participant_role}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {contract.formation_libelle}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {contract.entreprise_libelle}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {formatDate(contract.date_entree)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {formatDate(contract.date_sortiee)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
