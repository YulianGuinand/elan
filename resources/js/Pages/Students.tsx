import Pagination from "@/Components/Students/Pagination";
import StudentFilterBar from "@/Components/Students/StudentFilterBar";
import StudentTable from "@/Components/Students/StudentTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PaginatedStudents, StudentFilters } from "@/types/students";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

interface StudentsProps {
    students: PaginatedStudents;
    filters: StudentFilters;
}

export default function Students({
    students,
    filters: initialFilters,
}: StudentsProps) {
    const [filters, setFilters] = useState<StudentFilters>(initialFilters);

    // Gerer les changements de filtres
    const handleFiltersChange = (newFilters: StudentFilters) => {
        setFilters(newFilters);

        // Appliquer les filtres via Inertia
        router.get(
            route("participants.index"),
            {
                search: newFilters.search,
                program:
                    newFilters.program !== "all"
                        ? newFilters.program
                        : undefined,
                status:
                    newFilters.status !== "all" ? newFilters.status : undefined,
                page: 1, // Reinitialiser a la page 1 lors d'un changement de filtre
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Gerer le changement de page
    const handlePageChange = (page: number) => {
        router.get(
            route("participants.index"),
            {
                search: filters.search,
                program:
                    filters.program !== "all" ? filters.program : undefined,
                status: filters.status !== "all" ? filters.status : undefined,
                page,
            },
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    return (
        <>
            <Head title="Liste des Participants" />

            <DashboardLayout
                title="Liste des Participants"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Participants" },
                ]}
                actionButton={{
                    label: "Ajouter un participant",
                    onClick: () => router.get(route("participants.create")),
                }}
            >
                <div className="space-y-6">
                    {/* Description */}
                    <p className="text-gray-600">
                        Gérez les inscriptions, suivez les progrès et mettez à
                        jour les statuts.
                    </p>

                    {/* Barre de filtres */}
                    <StudentFilterBar
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                    />

                    {/* Tableau des participants */}
                    <StudentTable students={students.data} />

                    {/* Pagination */}
                    {students.data.length > 0 && (
                        <Pagination
                            meta={students.meta}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
