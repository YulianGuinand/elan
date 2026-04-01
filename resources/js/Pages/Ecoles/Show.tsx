import ContractsTable from "@/Components/Ecoles/ContractsTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Edit, MapPin } from "lucide-react";

interface Contract {
    id: number;
    participant_nom: string;
    participant_prenom: string;
    participant_role: string;
    formation_libelle: string;
    entreprise_libelle: string;
    date_entree: string;
    date_sortiee: string | null;
}

interface Ecole {
    id: number;
    libelle: string;
    adresse: string;
    code_postal: string;
    ville: string;
    created_at: string;
}

export default function Show({
    ecole,
    contrats,
}: {
    ecole: Ecole;
    contrats: Contract[];
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`École: ${ecole.libelle}`} />

            <DashboardLayout
                title="Détails de l'école"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Écoles", href: route("ecoles.index") },
                    { label: ecole.libelle },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="space-y-6 w-full">
                    {/* En-tête de l'école */}
                    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                        {auth.user.role_id !== 3 && (
                            <div className="absolute top-6 right-6 flex gap-2">
                                <button
                                    onClick={() =>
                                        router.get(
                                            route("ecoles.edit", ecole.id),
                                        )
                                    }
                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                                    title="Modifier"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="w-20 h-20 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-bold shadow-sm flex-shrink-0">
                            {ecole.libelle.charAt(0).toUpperCase()}
                        </div>

                        <div className="text-center md:text-left flex-1 mt-2 md:mt-0">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {ecole.libelle}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {ecole.ville} ({ecole.code_postal})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="w-full flex flex-col gap-6">
                        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                                Informations de localisation
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Adresse complète
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {ecole.adresse}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Code postal
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {ecole.code_postal}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Ville
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {ecole.ville}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                                Contrats (Apprentis / Formateurs)
                            </h2>
                            <ContractsTable contracts={contrats} />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
