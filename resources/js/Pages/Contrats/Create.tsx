import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { FileText } from "lucide-react";

interface Option {
    id: number;
    [key: string]: any;
}

interface Props {
    participants: Option[]; // {id, nom, prenom, role}
    ecoles: Option[]; // {id, libelle}
    entreprises: Option[]; // {id, raison_sociale}
    formations: Option[]; // {id, libelle}
}

export default function Create({
    participants,
    ecoles,
    entreprises,
    formations,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: "",
        formation_id: "",
        ecole_id: "",
        entreprise_id: "",
        date_entree: "",
        date_sortiee: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("contrats.store"));
    };

    return (
        <>
            <Head title="Créer un contrat" />

            <DashboardLayout
                title="Créer un contrat"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Contrats", href: route("contrats.index") },
                    { label: "Créer" },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Nouveau contrat
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Liez un participant à une formation, une
                                    école et éventuellement une entreprise.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Section 1 : Acteur Principal */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-500 mb-2">
                                    1. Acteur
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Participant (Apprenti / Formateur){" "}
                                        <span className="text-red-500">*</span>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="">
                                            Sélectionner un participant
                                        </option>
                                        {participants.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.prenom} {p.nom} ({p.role})
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
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-500 mb-2">
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">
                                                Sélectionner
                                            </option>
                                            {formations.map((f) => (
                                                <option key={f.id} value={f.id}>
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
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
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-500 mb-2">
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="">
                                            Aucune entreprise
                                        </option>
                                        {entreprises.map((ent) => (
                                            <option key={ent.id} value={ent.id}>
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
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    Créer le contrat
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
