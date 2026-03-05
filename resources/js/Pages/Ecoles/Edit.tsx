import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

interface Ecole {
    id: number;
    libelle: string;
    adresse: string;
    code_postal: string;
    ville: string;
}

export default function Edit({ ecole }: { ecole: Ecole }) {
    const { data, setData, put, processing, errors } = useForm({
        libelle: ecole.libelle || "",
        adresse: ecole.adresse || "",
        code_postal: ecole.code_postal || "",
        ville: ecole.ville || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("ecoles.update", ecole.id));
    };

    return (
        <>
            <Head title={`Modifier ${ecole.libelle}`} />

            <DashboardLayout
                title={`Modifier ${ecole.libelle}`}
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Écoles", href: route("ecoles.index") },
                    { label: "Modifier" },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <FadeIn delay={0}>
                        <form
                            onSubmit={submit}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom de l'école *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.libelle}
                                        onChange={(e) =>
                                            setData("libelle", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.libelle && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.libelle}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresse *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.adresse}
                                        onChange={(e) =>
                                            setData("adresse", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.adresse && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.adresse}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Code postal *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code_postal}
                                            onChange={(e) =>
                                                setData(
                                                    "code_postal",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                            required
                                        />
                                        {errors.code_postal && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.code_postal}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ville *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.ville}
                                            onChange={(e) =>
                                                setData("ville", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                            required
                                        />
                                        {errors.ville && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ville}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.get(route("ecoles.index"))
                                    }
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-elan-orange border border-transparent rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-elan-orange disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
