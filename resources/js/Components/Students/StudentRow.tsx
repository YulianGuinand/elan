import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import { PageProps } from "@/types";
import { Participant } from "@/types/participants";
import { router, usePage } from "@inertiajs/react";
import { Edit, Eye, Mail, MoreVertical, Phone, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface StudentRowProps {
    student: Participant;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function StudentRow({
    student,
    isSelected,
    onSelect,
}: StudentRowProps) {
    const { auth } = usePage<PageProps>().props;

    // Générer les initiales pour l'avatar
    const initials =
        `${student.prenom?.charAt(0) || ""}${student.nom?.charAt(0) || ""}`.toUpperCase();
    const fullName = `${student.prenom} ${student.nom}`;

    // Get primary program/formation from contrats if exists
    const primaryProgram =
        student.contrats && student.contrats.length > 0
            ? student.contrats[0].formation?.libelle || "Non spécifié"
            : "Non spécifié";

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Checkbox */}
            <td className="px-4 sm:px-6 py-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(student.id)}
                    className="w-4 h-4 rounded border-gray-300 text-elan-orange focus:ring-elan-orange cursor-pointer"
                />
            </td>

            {/* Apprenant */}
            <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            Inscrit le{" "}
                            {student.created_at
                                ? new Date(
                                      student.created_at,
                                  ).toLocaleDateString("fr-FR", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a
                            href={`mailto:${student.mail}`}
                            className="hover:text-elan-orange truncate"
                        >
                            {student.mail}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a
                            href={`tel:${student.telephone}`}
                            className="hover:text-elan-orange"
                        >
                            {student.telephone}
                        </a>
                    </div>
                </div>
            </td>

            {/* Programme */}
            <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                <p className="text-sm text-gray-900">{primaryProgram}</p>
            </td>

            {/* Statut */}
            <td className="px-4 sm:px-6 py-4">
                <StatusBadge status={student.statut} />
            </td>

            {/* Actions */}
            <td className="px-4 sm:px-6 py-4">
                <DropdownMenu
                    trigger={
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    }
                >
                    <DropdownItem
                        onClick={() =>
                            router.get(route("participants.show", student.id))
                        }
                        icon={<Eye className="w-4 h-4" />}
                    >
                        Voir les détails
                    </DropdownItem>

                    {auth.user.role_id !== 3 && (
                        <>
                            <DropdownItem
                                onClick={() =>
                                    router.get(
                                        route("participants.edit", student.id),
                                    )
                                }
                                icon={<Edit className="w-4 h-4" />}
                            >
                                Modifier
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Voulez-vous vraiment supprimer ce participant ?",
                                        )
                                    ) {
                                        router.delete(
                                            route(
                                                "participants.destroy",
                                                student.id,
                                            ),
                                        );
                                    }
                                }}
                                icon={<Trash2 className="w-4 h-4" />}
                                danger
                            >
                                Supprimer
                            </DropdownItem>
                        </>
                    )}
                </DropdownMenu>
            </td>
        </tr>
    );
}
