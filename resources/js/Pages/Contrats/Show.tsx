import FadeIn from "@/Components/Animations/FadeIn";
import ConfirmDialog from "@/Components/ConfirmDialog";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Briefcase,
    Building2,
    Calendar,
    GraduationCap,
    Trash2,
} from "lucide-react";
import { useState } from "react";

interface Props {
    contrat: {
        id: number;
        utilisateur_id: number;
        date_entree: string;
        date_sortiee: string | null;
        created_at: string;
        participant: {
            id: number;
            nom: string;
            prenom: string;
            role: string;
            mail: string;
            telephone: string;
        };
        formation: {
            id: number;
            libelle: string;
        };
        ecole: {
            id: number;
            libelle: string;
        };
        entreprise?: {
            id: number;
            raison_sociale: string;
        };
    };
}

export default function Show({ contrat }: Props) {
    const { auth } = usePage<PageProps>().props;

    // RBAC: Superadmin can edit all, Admin can edit their own, User cannot edit
    const canManage =
        auth.user.role === "superadmin" ||
        (auth.user.role === "admin" && contrat.utilisateur_id === auth.user.id);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        router.delete(route("contrats.destroy", contrat.id), {
            onFinish: () => {
                setIsDeleting(false);
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <>
            <Head
                title={`Contrat : ${contrat.participant.prenom} ${contrat.participant.nom}`}
            />

            <DashboardLayout
                title="Détails du contrat"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Contrats", href: route("contrats.index") },
                    { label: "Détails" },
                ]}
                actionButton={
                    canManage
                        ? {
                              label: "Modifier",
                              onClick: () =>
                                  router.get(
                                      route("contrats.edit", contrat.id),
                                  ),
                          }
                        : undefined
                }
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* En-tête du contrat */}
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 md:p-8 bg-gradient-to-br from-orange-50 to-white flex items-start justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm">
                                        {contrat.participant.prenom
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                            Contrat de{" "}
                                            {contrat.participant.prenom}{" "}
                                            {contrat.participant.nom}
                                        </h1>
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            Étudiant {contrat.participant.role}
                                        </span>
                                    </div>
                                </div>

                                {canManage && (
                                    <button
                                        onClick={() =>
                                            setShowDeleteDialog(true)
                                        }
                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Supprimer ce contrat"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Informations réparties */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                                {/* Colonne Formation & Ecole */}
                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4" />
                                            Parcours académique
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Formation suivie
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {contrat.formation.libelle}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Établissement
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    <p className="font-medium text-gray-700">
                                                        {contrat.ecole.libelle}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne Entreprise & Dates */}
                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Informations professionnelles
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Entreprise d'accueil
                                                </p>
                                                {contrat.entreprise ? (
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            contrat.entreprise
                                                                .raison_sociale
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-400 italic">
                                                        Aucune entreprise
                                                        assignée
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        Date d'entrée
                                                    </p>
                                                    <p className="font-medium text-gray-700">
                                                        {new Date(
                                                            contrat.date_entree,
                                                        ).toLocaleDateString(
                                                            "fr-FR",
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        Date de fin prévue
                                                    </p>
                                                    {contrat.date_sortiee ? (
                                                        <p className="font-medium text-gray-700">
                                                            {new Date(
                                                                contrat.date_sortiee,
                                                            ).toLocaleDateString(
                                                                "fr-FR",
                                                            )}
                                                        </p>
                                                    ) : (
                                                        <p className="text-gray-400 italic">
                                                            Non renseignée
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleConfirmDelete}
                    title="Supprimer le contrat"
                    message="Êtes-vous sûr de vouloir supprimer ce contrat ?"
                    confirmText="Supprimer"
                    cancelText="Annuler"
                    variant="danger"
                    isLoading={isDeleting}
                />
            </DashboardLayout>
        </>
    );
}
