import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import { Building2, Edit, Mail, MapPin, Phone, Users } from "lucide-react";

interface Entreprise {
    id: number;
    raison_sociale: string | null;
    mail: string | null;
    telephone: string | null;
    ville: string | null;
    interlocuteur: string | null;
    created_at: string;
}

export default function EntrepriseShow({
    entreprise,
}: {
    entreprise: Entreprise;
}) {
    return (
        <>
            <Head title={entreprise.raison_sociale ?? "Entreprise"} />

            <DashboardLayout
                title="Fiche entreprise"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Entreprises", href: route("entreprises.index") },
                    { label: entreprise.raison_sociale ?? "Entreprise" },
                ]}
                actionButton={{
                    label: "Modifier",
                    onClick: () =>
                        router.get(route("entreprises.edit", entreprise.id)),
                }}
            >
                <div className="max-w-2xl space-y-6">
                    {/* En-tête */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-orange-600">
                                {(entreprise.raison_sociale ?? "?")
                                    .split(" ")
                                    .map((w) => w[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {entreprise.raison_sociale ?? "—"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Ajoutée le{" "}
                                {new Date(
                                    entreprise.created_at,
                                ).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                router.get(
                                    route("entreprises.edit", entreprise.id),
                                )
                            }
                            className="ml-auto p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Modifier"
                        >
                            <Edit className="w-4 h-4 text-gray-700" />
                        </button>
                    </div>

                    {/* Détails */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                            Informations
                        </h2>

                        <InfoRow
                            icon={<Users className="w-4 h-4 text-gray-400" />}
                            label="Interlocuteur"
                            value={entreprise.interlocuteur}
                        />
                        <InfoRow
                            icon={<Mail className="w-4 h-4 text-gray-400" />}
                            label="Email"
                            value={entreprise.mail}
                        />
                        <InfoRow
                            icon={<Phone className="w-4 h-4 text-gray-400" />}
                            label="Téléphone"
                            value={entreprise.telephone}
                        />
                        <InfoRow
                            icon={<MapPin className="w-4 h-4 text-gray-400" />}
                            label="Ville"
                            value={entreprise.ville}
                        />
                        <InfoRow
                            icon={
                                <Building2 className="w-4 h-4 text-gray-400" />
                            }
                            label="Raison sociale"
                            value={entreprise.raison_sociale}
                        />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span>{icon}</span>
            <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">
                    {value ?? "—"}
                </p>
            </div>
        </div>
    );
}
