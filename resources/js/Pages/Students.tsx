import Modal from "@/Components/Modal";
import Pagination from "@/Components/Students/Pagination";
import StudentCsvImport from "@/Components/Students/StudentCsvImport";
import StudentFilterBar from "@/Components/Students/StudentFilterBar";
import StudentTable from "@/Components/Students/StudentTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import {
    Formation,
    PaginatedParticipants,
    ParticipantFilters,
} from "@/types/participants";
import { Head, router, usePage } from "@inertiajs/react";
import { Upload } from "lucide-react";
import { useState } from "react";

interface ParticipantsProps {
    participants: PaginatedParticipants;
    formations: Formation[];
    filters: ParticipantFilters;
}

export default function Students({
    participants,
    formations,
    filters: initialFilters,
}: ParticipantsProps) {
    const { auth } = usePage<PageProps>().props;
    const [filters, setFilters] = useState<ParticipantFilters>(initialFilters);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Gerer les changements de filtres
    const handleFiltersChange = (newFilters: ParticipantFilters) => {
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
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
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
                page,
            },
            {
                preserveState: true,
                preserveScroll: false,
            },
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
                actionButton={
                    auth.user.role_id !== 3
                        ? {
                              label: "Ajouter un participant",
                              onClick: () =>
                                  router.get(route("participants.create")),
                          }
                        : undefined
                }
            >
                <div className="space-y-6">
                    {/* Description et Bouton d'import */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-gray-600">
                            Gérez les inscriptions, suivez les progrès et mettez
                            à jour les statuts.
                        </p>
                        {auth.user.role_id !== 3 && (
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-elan-orange bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Importer CSV
                            </button>
                        )}
                    </div>

                    <Modal
                        show={isImportModalOpen}
                        onClose={() => setIsImportModalOpen(false)}
                        maxWidth="2xl"
                    >
                        <div className="p-6">
                            <StudentCsvImport />
                        </div>
                    </Modal>

                    {/* Barre de filtres */}
                    <StudentFilterBar
                        formations={formations}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                    />

                    {/* Tableau des participants */}
                    <StudentTable students={participants.data} />

                    {/* Pagination */}
                    {participants.data.length > 0 && (
                        <Pagination
                            meta={participants as any}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
