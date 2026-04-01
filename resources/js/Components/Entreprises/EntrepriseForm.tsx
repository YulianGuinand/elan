import { useForm } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import { FormEventHandler } from "react";

const SECTEURS = [
    "Informatique & Tech",
    "Industrie",
    "Commerce & Distribution",
    "Bâtiment & Travaux Publics",
    "Santé & Social",
    "Restauration & Hôtellerie",
    "Transport & Logistique",
    "Agriculture",
    "Finance & Assurance",
    "Éducation & Formation",
    "Autre",
];

const TAILLES = [
    { value: "tpe", label: "TPE (< 10 salariés)" },
    { value: "pme", label: "PME (10 – 249 salariés)" },
    { value: "eti", label: "ETI (250 – 4999 salariés)" },
    { value: "ge", label: "GE (≥ 5000 salariés)" },
];

interface EntrepriseFormProps {
    onCancel?: () => void;
}

export default function EntrepriseForm({ onCancel }: EntrepriseFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        raison_sociale: "",
        adresse: "",
        code_postal: "",
        ville: "",
        nom: "",
        prenom: "",
        mail: "",
        telephone: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("entreprises.store"), {
            onSuccess: () => {
                reset();
                if (onCancel) onCancel();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6 w-full">
            {/* En-tête section */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-base font-semibold text-gray-800">
                    Détails de l'entreprise
                </h2>
            </div>

            {/* Ligne 1 : Raison sociale + SIRET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Raison sociale <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.raison_sociale}
                        onChange={(e) =>
                            setData("raison_sociale", e.target.value)
                        }
                        placeholder="Ex: Tech Solutions SAS"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                    {errors.raison_sociale && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.raison_sociale}
                        </p>
                    )}
                </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                    </label>
                    <input
                        type="text"
                        value={data.adresse}
                        onChange={(e) => setData("adresse", e.target.value)}
                        placeholder="Ex: 12 rue de la République"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal
                    </label>
                    <input
                        type="text"
                        value={data.code_postal}
                        onChange={(e) => setData("code_postal", e.target.value)}
                        placeholder="Ex: 75001"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                </label>
                <input
                    type="text"
                    value={data.ville}
                    onChange={(e) => setData("ville", e.target.value)}
                    placeholder="Ex: Paris"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
            </div>

            {/* Section Contact */}
            <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
                    Contact principal
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={data.nom}
                            onChange={(e) => setData("nom", e.target.value)}
                            placeholder="Nom"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        {errors.nom && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.nom}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={data.prenom}
                            onChange={(e) => setData("prenom", e.target.value)}
                            placeholder="Prénom"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        {errors.prenom && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.prenom}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email professionnel{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={data.mail}
                            onChange={(e) => setData("mail", e.target.value)}
                            placeholder="contact@entreprise.fr"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        {errors.mail && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.mail}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={data.telephone}
                            onChange={(e) =>
                                setData("telephone", e.target.value)
                            }
                            placeholder="06 .. .. .. .."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        {errors.telephone && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.telephone}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        if (onCancel) onCancel();
                    }}
                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
                >
                    Ajouter l'entreprise
                </button>
            </div>
        </form>
    );
}
