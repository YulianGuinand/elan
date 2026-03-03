import { PageProps } from "@/types";
import { Participant } from "@/types/participants";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import StudentRow from "./StudentRow";

interface StudentTableProps {
    students: Participant[];
}

export default function StudentTable({ students }: StudentTableProps) {
    const { auth } = usePage<PageProps>().props;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = () => {
        if (selectedIds.length === students.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map((s) => s.id));
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id),
            );
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const allSelected =
        students.length > 0 && selectedIds.length === students.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < students.length;

    const handleBulkDelete = () => {
        if (!confirm("Voulez-vous vraiment supprimer ces participants ?"))
            return;
        router.post(
            route("participants.bulk-destroy"),
            { ids: selectedIds },
            {
                onSuccess: () => setSelectedIds([]),
            },
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-slideUp">
            {selectedIds.length > 0 && (
                <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center justify-between">
                    <span className="text-sm text-red-700 font-medium">
                        {selectedIds.length} participant(s) sélectionné(s)
                    </span>
                    {auth.user.role_id !== 3 && (
                        <button
                            onClick={handleBulkDelete}
                            className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Supprimer la sélection
                        </button>
                    )}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-10 px-2 sm:px-3 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(input) => {
                                        if (input) {
                                            input.indeterminate = someSelected;
                                        }
                                    }}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-elan-orange focus:ring-elan-orange cursor-pointer"
                                />
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Participant
                                </span>
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left hidden md:table-cell">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contact
                                </span>
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left hidden lg:table-cell">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Programme
                                </span>
                            </th>

                            <th className="px-4 sm:px-6 py-3 text-left">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center"
                                >
                                    <p className="text-gray-500">
                                        Aucun apprenant trouvé
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <StudentRow
                                    key={student.id}
                                    student={student}
                                    isSelected={selectedIds.includes(
                                        student.id,
                                    )}
                                    onSelect={handleSelectOne}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
