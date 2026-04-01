import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";

interface Entreprise {
    id: number;
    raison_sociale: string | null;
    mail: string | null;
    telephone: string | null;
    ville: string | null;
    interlocuteur: string | null;
}

function inputClass(hasError?: boolean) {
    return `w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all bg-white
        ${
            hasError
                ? "border-red-400 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        }`;
}

export default function EntrepriseEdit({
    entreprise,
}: {
    entreprise: Entreprise;
}) {
    const { data, setData, put, processing, errors } = useForm({
        raison_sociale: entreprise.raison_sociale ?? "",
        mail: entreprise.mail ?? "",
        telephone: entreprise.telephone ?? "",
        ville: entreprise.ville ?? "",
        interlocuteur: entreprise.interlocuteur ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("entreprises.update", entreprise.id));
    };

    return (
        <>
            <Head
                title={`Modifier ${entreprise.raison_sociale ?? "l'entreprise"}`}
            />

            <DashboardLayout
                title="Modifier l'entreprise"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Entreprises", href: route("entreprises.index") },
                    {
                        label: entreprise.raison_sociale ?? "Entreprise",
                        href: route("entreprises.show", entreprise.id),
                    },
                    { label: "Modifier" },
                ]}
                actionButton={{
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="w-full flex items-center justify-center">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Raison sociale{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className={inputClass(
                                            !!errors.raison_sociale,
                                        )}
                                        value={data.raison_sociale}
                                        onChange={(e) =>
                                            setData(
                                                "raison_sociale",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tech Solutions SAS"
                                    />
                                    {errors.raison_sociale && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.raison_sociale}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={inputClass(!!errors.mail)}
                                        value={data.mail}
                                        onChange={(e) =>
                                            setData("mail", e.target.value)
                                        }
                                        placeholder="contact@entreprise.fr"
                                    />
                                    {errors.mail && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.mail}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Téléphone
                                        </label>
                                        <input
                                            className={inputClass()}
                                            value={data.telephone}
                                            onChange={(e) =>
                                                setData(
                                                    "telephone",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="06 12 34 56 78"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ville
                                        </label>
                                        <input
                                            className={inputClass()}
                                            value={data.ville}
                                            onChange={(e) =>
                                                setData("ville", e.target.value)
                                            }
                                            placeholder="Paris"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Interlocuteur
                                    </label>
                                    <input
                                        className={inputClass()}
                                        value={data.interlocuteur}
                                        onChange={(e) =>
                                            setData(
                                                "interlocuteur",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Marie Dupont"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-elan-orange hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing
                                            ? "Enregistrement…"
                                            : "Enregistrer"}
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
