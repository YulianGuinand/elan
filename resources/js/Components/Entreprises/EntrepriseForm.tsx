import { Building2 } from "lucide-react";
import { useRef } from "react";

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
    const formRef = useRef<HTMLFormElement>(null);

    const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
            ?.content ?? "";

    const handleCancel = () => {
        formRef.current?.reset();
        onCancel?.();
    };

    return (
        /*
         * Formulaire HTML natif (non-Inertia/XHR) pour que dd() s'affiche
         * correctement dans le navigateur.
         */
        <form
            ref={formRef}
            method="POST"
            action={route("entreprises.store")}
            className="space-y-6"
        >
            <input type="hidden" name="_token" value={csrfToken} />

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
                        name="raison_sociale"
                        placeholder="Ex: Tech Solutions SAS"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro SIRET <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="siret"
                        placeholder="14 chiffres"
                        maxLength={14}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Ligne 2 : Secteur + Taille */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secteur d'activité
                    </label>
                    <select
                        name="secteur"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                        <option value="">— Sélectionner —</option>
                        {SECTEURS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taille de l'entreprise
                    </label>
                    <select
                        name="taille"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                        <option value="">— Sélectionner —</option>
                        {TAILLES.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
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
                        name="adresse"
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
                        name="code_postal"
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
                    name="ville"
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
                            Nom complet
                        </label>
                        <input
                            type="text"
                            name="interlocuteur"
                            placeholder="Prénom Nom"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email professionnel
                        </label>
                        <input
                            type="email"
                            name="mail"
                            placeholder="contact@entreprise.fr"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            name="telephone"
                            placeholder="06 .. .. .. .."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fonction / Poste
                        </label>
                        <input
                            type="text"
                            name="fonction"
                            placeholder="Ex: Responsable RH"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                    Ajouter l'entreprise
                </button>
            </div>
        </form>
    );
}
