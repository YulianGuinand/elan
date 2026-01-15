import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import { Student } from "@/types/students";
import {
    Edit,
    Eye,
    Mail,
    MoreVertical,
    Phone,
    RefreshCw,
    Trash2,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

interface StudentRowProps {
    student: Student;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function StudentRow({
    student,
    isSelected,
    onSelect,
}: StudentRowProps) {
    // Générer les initiales pour l'avatar
    const initials = `${student.first_name.charAt(0)}${student.last_name.charAt(
        0
    )}`.toUpperCase();

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
                    {student.avatar ? (
                        <img
                            src={student.avatar}
                            alt={student.full_name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {student.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            Inscrit le{" "}
                            {new Date(
                                student.enrollment_date
                            ).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
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
                            href={`mailto:${student.email}`}
                            className="hover:text-elan-orange truncate"
                        >
                            {student.email}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a
                            href={`tel:${student.phone}`}
                            className="hover:text-elan-orange"
                        >
                            {student.phone}
                        </a>
                    </div>
                </div>
            </td>

            {/* Programme */}
            <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                <p className="text-sm text-gray-900">{student.program}</p>
            </td>

            {/* Statut */}
            <td className="px-4 sm:px-6 py-4">
                <StatusBadge status={student.status} />
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
                        onClick={() => console.log("Voir détails", student.id)}
                        icon={<Eye className="w-4 h-4" />}
                    >
                        Voir les détails
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => console.log("Modifier", student.id)}
                        icon={<Edit className="w-4 h-4" />}
                    >
                        Modifier
                    </DropdownItem>
                    <DropdownItem
                        onClick={() =>
                            console.log("Changer statut", student.id)
                        }
                        icon={<RefreshCw className="w-4 h-4" />}
                    >
                        Changer le statut
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                        onClick={() => console.log("Supprimer", student.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                        danger
                    >
                        Supprimer
                    </DropdownItem>
                </DropdownMenu>
            </td>
        </tr>
    );
}
