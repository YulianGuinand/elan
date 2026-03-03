import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { BookOpen, Clock, Edit, Trash2, Users } from "lucide-react";

interface Props {
    formation: {
        id: number;
        libelle: string;
        created_at: string;
        updated_at: string;
        contrats?: Array<{
            id: number;
            participant: {
                id: number;
                nom: string;
                prenom: string;
                role: string;
            };
            entreprise?: {
                id: number;
                raison_sociale: string;
            };
            ecole: {
                id: number;
                libelle: string;
            };
        }>;
    };
}

export default function Show({ formation }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canManage = auth.user.role_id !== 3;

    return (
        <>
            <Head title={`Formation : ${formation.libelle}`} />

            <DashboardLayout
                title="Détails de la formation"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Formations", href: route("formations.index") },
                    { label: formation.libelle },
                ]}
                actionButton={
                    canManage
                        ? {
                              label: "Modifier",
                              onClick: () =>
                                  router.get(
                                      route("formations.edit", formation.id),
                                  ),
                          }
                        : undefined
                }
            >
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* En-tête de la formation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <BookOpen className="w-8 h-8 text-orange-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                        {formation.libelle}
                                    </h1>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Ajouté le{" "}
                                        {new Date(
                                            formation.created_at,
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                            </div>

                            {canManage && (
                                <div className="flex gap-3 w-full md:w-auto">
                                    <Link
                                        href={route(
                                            "formations.edit",
                                            formation.id,
                                        )}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Êtes-vous sûr de vouloir supprimer cette formation ?",
                                                )
                                            ) {
                                                router.delete(
                                                    route(
                                                        "formations.destroy",
                                                        formation.id,
                                                    ),
                                                );
                                            }
                                        }}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Participants */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-bold text-gray-900">
                                    Participants associés
                                </h2>
                            </div>
                            <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-xs font-semibold">
                                {formation.contrats?.length || 0}
                            </span>
                        </div>

                        {formation.contrats && formation.contrats.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {formation.contrats.map((contrat) => (
                                    <div
                                        key={contrat.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                    {contrat.participant.prenom
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <Link
                                                        href={route(
                                                            "participants.show",
                                                            contrat.participant
                                                                .id,
                                                        )}
                                                        className="font-bold text-gray-900 hover:text-orange-600 transition-colors block"
                                                    >
                                                        {
                                                            contrat.participant
                                                                .prenom
                                                        }{" "}
                                                        {
                                                            contrat.participant
                                                                .nom
                                                        }
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            contrat.participant
                                                                .role
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 sm:text-right">
                                                <p className="font-medium text-gray-900">
                                                    {contrat.ecole.libelle}
                                                </p>
                                                {contrat.entreprise ? (
                                                    <p className="text-gray-500">
                                                        {
                                                            contrat.entreprise
                                                                .raison_sociale
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-400 italic">
                                                        Aucune entreprise
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    Aucun participant
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Il n'y a actuellement aucun participant
                                    associé à cette formation.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
