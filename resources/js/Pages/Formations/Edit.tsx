import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { AlertCircle, BookOpen } from "lucide-react";

interface Props {
    formation: {
        id: number;
        libelle: string;
    };
}

export default function Edit({ formation }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        libelle: formation.libelle,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("formations.update", formation.id));
    };

    return (
        <>
            <Head title={`Modifier : ${formation.libelle}`} />

            <DashboardLayout
                title="Modifier une formation"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Formations", href: route("formations.index") },
                    {
                        label: formation.libelle,
                        href: route("formations.show", formation.id),
                    },
                    { label: "Modifier" },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Modifier la formation
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Mettez à jour les informations du
                                        programme.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Libellé de la formation{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.libelle}
                                        onChange={(e) =>
                                            setData("libelle", e.target.value)
                                        }
                                        placeholder="Ex: BTS SIO SLAM"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                    />
                                    {errors.libelle && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.libelle}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>
                                        La modification du libellé sera
                                        répercutée chez tous les étudiants
                                        assignés à cette formation.
                                    </p>
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
                                        Enregistrer les modifications
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
