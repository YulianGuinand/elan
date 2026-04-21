import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { ChevronLeft, Edit } from "lucide-react";

interface Option {
    id: number;
    [key: string]: any;
}

interface Contrat {
    id: number;
    participant_id: number;
    formation_id: number;
    ecole_id: number;
    entreprise_id: number | null;
    date_entree: string;
    date_sortiee: string | null;
}

interface Props {
    contrat: Contrat;
    participants: Option[];
    ecoles: Option[];
    entreprises: Option[];
    formations: Option[];
}

export default function EditContrat({
    contrat,
    participants,
    ecoles,
    entreprises,
    formations,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        participant_id: contrat.participant_id.toString(),
        formation_id: contrat.formation_id.toString(),
        ecole_id: contrat.ecole_id.toString(),
        entreprise_id: contrat.entreprise_id
            ? contrat.entreprise_id.toString()
            : "",
        date_entree: contrat.date_entree
            ? new Date(contrat.date_entree).toISOString().split("T")[0]
            : "",
        date_sortiee: contrat.date_sortiee
            ? new Date(contrat.date_sortiee).toISOString().split("T")[0]
            : "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("contrats.update", contrat.id));
    };

    return (
        <>
            <Head title="Modifier le contrat" />

            <DashboardLayout
                title="Modifier le contrat"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Contrats", href: route("contrats.index") },
                    { label: "Modifier" },
                ]}
                actionButton={{
                    icon: <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />,
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-3xl mx-auto">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Edit className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Modifier le contrat
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Mettez à jour les informations du
                                        contrat.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Section 1 : Acteur Principal */}
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500 mb-2">
                                        1. Acteur
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Participant (Apprentis / Formateurs){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            required
                                            value={data.participant_id}
                                            onChange={(e) =>
                                                setData(
                                                    "participant_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">
                                                Sélectionner un participant
                                            </option>
                                            {participants.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.prenom} {p.nom} ({p.role}
                                                    )
                                                </option>
                                            ))}
                                        </select>
                                        {errors.participant_id && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.participant_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Section 2 : Formation & Académique */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500 mb-2">
                                        2. Cursus Académique
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Formation{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                required
                                                value={data.formation_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "formation_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                            >
                                                <option value="">
                                                    Sélectionner
                                                </option>
                                                {formations.map((f) => (
                                                    <option
                                                        key={f.id}
                                                        value={f.id}
                                                    >
                                                        {f.libelle}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.formation_id && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.formation_id}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                École{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                required
                                                value={data.ecole_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "ecole_id",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                            >
                                                <option value="">
                                                    Sélectionner
                                                </option>
                                                {ecoles.map((ec) => (
                                                    <option
                                                        key={ec.id}
                                                        value={ec.id}
                                                    >
                                                        {ec.libelle}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ecole_id && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.ecole_id}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date de début (Entrée){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.date_entree}
                                                onChange={(e) =>
                                                    setData(
                                                        "date_entree",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                            />
                                            {errors.date_entree && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.date_entree}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date de fin (Sortie)
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_sortiee}
                                                onChange={(e) =>
                                                    setData(
                                                        "date_sortiee",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                            />
                                            {errors.date_sortiee && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.date_sortiee}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3 : Professionnel */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500 mb-2">
                                        3. Professionnel
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Entreprise d'accueil (Optionnel)
                                        </label>
                                        <select
                                            value={data.entreprise_id}
                                            onChange={(e) =>
                                                setData(
                                                    "entreprise_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">
                                                Aucune entreprise
                                            </option>
                                            {entreprises.map((ent) => (
                                                <option
                                                    key={ent.id}
                                                    value={ent.id}
                                                >
                                                    {ent.raison_sociale}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        Mettre à jour
                                    </button>
                                </div>
                            </form>
                        </div>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
