import StatusBadge from "@/Components/Students/StatusBadge";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Participant } from "@/types/participants";
import { Head, router } from "@inertiajs/react";
import { Briefcase, Edit, GraduationCap, Mail, Phone } from "lucide-react";

export default function Show({ participant }: { participant: Participant }) {
    return (
        <>
            <Head
                title={`Profil de ${participant.prenom} ${participant.nom}`}
            />

            <DashboardLayout
                title="Profil apprenant"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    {
                        label: "Participants",
                        href: route("participants.index"),
                    },
                    { label: `${participant.prenom} ${participant.nom}` },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="space-y-6">
                    {/* En-tête du profil */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button
                                onClick={() =>
                                    router.get(
                                        route(
                                            "participants.edit",
                                            participant.id,
                                        ),
                                    )
                                }
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                                title="Modifier"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-sm">
                            {`${participant.prenom?.charAt(0) || ""}${participant.nom?.charAt(0) || ""}`.toUpperCase()}
                        </div>

                        <div className="text-center md:text-left flex-1 mt-2 md:mt-0">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {participant.prenom} {participant.nom}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                <StatusBadge status={participant.statut} />
                                <span className="text-sm text-gray-500">
                                    Inscrit le{" "}
                                    {participant.created_at
                                        ? new Date(
                                              participant.created_at,
                                          ).toLocaleDateString("fr-FR", {
                                              day: "2-digit",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Date inconnue"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Grille d'informations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Coordonnées */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Coordonnées
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">
                                            Email professionnel
                                        </p>
                                        <a
                                            href={`mailto:${participant.mail}`}
                                            className="text-sm font-medium text-gray-900 hover:text-elan-orange transition-colors"
                                        >
                                            {participant.mail}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">
                                            Téléphone professionnel
                                        </p>
                                        <a
                                            href={`tel:${participant.telephone}`}
                                            className="text-sm font-medium text-gray-900 hover:text-elan-orange transition-colors"
                                        >
                                            {participant.telephone ||
                                                "Non renseigné"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Programme & Entreprise */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Parcours
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-elan-orange">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mr-4">
                                        <GraduationCap className="w-5 h-5 text-elan-orange" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-0.5">
                                            Programme actuel
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {participant.contrats &&
                                            participant.contrats.length > 0
                                                ? participant.contrats[0]
                                                      .formation?.libelle
                                                : "Aucun programme"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-elan-blue">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mr-4">
                                        <Briefcase className="w-5 h-5 text-elan-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-0.5">
                                            Entreprise d'accueil
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {participant.entreprises &&
                                            participant.entreprises.length > 0
                                                ? participant.entreprises[0]
                                                      .raison_sociale
                                                : "Aucune entreprise"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
