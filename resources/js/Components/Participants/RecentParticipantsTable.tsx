import Badge from "@/Components/Common/Badge";
import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import { RecentParticipant } from "@/types/participant";
import { router } from "@inertiajs/react";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import ParticipantAvatar from "./ParticipantAvatar";

interface RecentParticipantsTableProps {
    participants: RecentParticipant[];
}

const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case "apprenant":
            return "info";
        case "employeur":
            return "warning";
        case "tuteur":
            return "success";
        case "formateur":
            return "primary";
        default:
            return "info";
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Aujourd'hui";
    } else if (diffDays === 1) {
        return "Hier";
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else {
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }
};

export default function RecentParticipantsTable({
    participants,
}: RecentParticipantsTableProps) {
    const handleView = (id: number) => {
        router.visit(`/participants/${id}`);
    };

    const handleEdit = (id: number) => {
        router.visit(`/participants/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce participant ?")) {
            router.delete(`/participants/${id}`);
        }
    };

    if (participants.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    Aucun participant ajouté récemment
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                            Participant
                        </th>
                        <th
                            scope="col"
                            className="hidden sm:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                            Rôle
                        </th>
                        <th
                            scope="col"
                            className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                            Date d'ajout
                        </th>
                        <th
                            scope="col"
                            className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                            Statut
                        </th>
                        <th
                            scope="col"
                            className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant, index) => (
                        <tr
                            key={participant.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <ParticipantAvatar
                                        prenom={participant.prenom}
                                        nom={participant.nom}
                                        size="md"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {participant.prenom}{" "}
                                            {participant.nom}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {participant.email}
                                        </p>
                                        {/* Mobile: Show role inline */}
                                        <div className="sm:hidden mt-1">
                                            <Badge
                                                variant={getRoleBadgeVariant(
                                                    participant.role
                                                )}
                                                className="text-xs uppercase"
                                            >
                                                {participant.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 lg:px-6 py-4 whitespace-nowrap">
                                <Badge
                                    variant={getRoleBadgeVariant(
                                        participant.role
                                    )}
                                    className="uppercase"
                                >
                                    {participant.role}
                                </Badge>
                            </td>
                            <td className="hidden md:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatDate(participant.created_at)}
                            </td>
                            <td className="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap">
                                <Badge variant="success" className="uppercase">
                                    ✓ {participant.statut}
                                </Badge>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DropdownMenu
                                    trigger={
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4 text-gray-600" />
                                        </button>
                                    }
                                    align="right"
                                    index={index}
                                >
                                    <DropdownItem
                                        onClick={() =>
                                            handleView(participant.id!)
                                        }
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Voir
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() =>
                                            handleEdit(participant.id!)
                                        }
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Modifier
                                    </DropdownItem>
                                    <DropdownDivider />
                                    <DropdownItem
                                        onClick={() =>
                                            handleDelete(participant.id!)
                                        }
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </DropdownItem>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
