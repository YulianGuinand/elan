import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { BookOpen } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        libelle: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("formations.store"));
    };

    return (
        <>
            <Head title="Ajouter une formation" />

            <DashboardLayout
                title="Ajouter une formation"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Formations", href: route("formations.index") },
                    { label: "Ajouter" },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Nouvelle Formation
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Enregistrez un nouveau programme de
                                    formation.
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
                                    Créer la formation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
