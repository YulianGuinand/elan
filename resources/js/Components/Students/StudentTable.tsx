import { Student } from "@/types/students";
import { useState } from "react";
import StudentRow from "./StudentRow";

interface StudentTableProps {
    students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
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
                selectedIds.filter((selectedId) => selectedId !== id)
            );
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const allSelected =
        students.length > 0 && selectedIds.length === students.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < students.length;

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-slideUp">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left">
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
                                    Apprenant
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
                                    Statut
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
                                    colSpan={6}
                                    className="px-6 py-12 text-center"
                                >
                                    <p className="text-gray-500">
                                        Aucun apprenant trouvé
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <StudentRow
                                    key={student.id}
                                    student={student}
                                    isSelected={selectedIds.includes(
                                        student.id
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
