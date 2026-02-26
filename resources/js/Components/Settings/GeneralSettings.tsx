import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    GeneralSettings as GeneralSettingsType,
    UserSettings,
} from "@/types/settings";
import { useForm } from "@inertiajs/react";
import { Calendar, Clock, Globe, List } from "lucide-react";
import { FormEventHandler } from "react";

interface GeneralSettingsProps {
    settings: GeneralSettingsType;
    user: UserSettings;
}

export default function GeneralSettings({
    settings,
    user,
}: GeneralSettingsProps) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm(settings);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("settings.general.update"));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Informations du rôle */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                    Informations du compte
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Rôle</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                            {user.role}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Statut du compte
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                    user.email_verified_at
                                        ? "bg-green-500"
                                        : "bg-orange-500"
                                }`}
                            ></span>
                            <p className="text-base font-semibold text-gray-900">
                                {user.email_verified_at
                                    ? "Vérifié"
                                    : "En attente de vérification"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Paramètres de l'application */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Paramètres de l'application
                </h3>

                <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                    {/* Langue */}
                    <div>
                        <InputLabel htmlFor="language" value="Langue" />
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="language"
                                name="language"
                                value={data.language}
                                onChange={(e) =>
                                    setData("language", e.target.value)
                                }
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </select>
                        </div>
                        <InputError
                            message={errors.language}
                            className="mt-2"
                        />
                    </div>

                    {/* Fuseau horaire */}
                    <div>
                        <InputLabel htmlFor="timezone" value="Fuseau horaire" />
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="timezone"
                                name="timezone"
                                value={data.timezone}
                                onChange={(e) =>
                                    setData("timezone", e.target.value)
                                }
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="Europe/Paris">
                                    Europe/Paris (GMT+1)
                                </option>
                                <option value="Europe/London">
                                    Europe/London (GMT+0)
                                </option>
                                <option value="America/New_York">
                                    America/New York (GMT-5)
                                </option>
                            </select>
                        </div>
                        <InputError
                            message={errors.timezone}
                            className="mt-2"
                        />
                    </div>

                    {/* Format de date */}
                    <div>
                        <InputLabel
                            htmlFor="date_format"
                            value="Format de date"
                        />
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="date_format"
                                name="date_format"
                                value={data.date_format}
                                onChange={(e) =>
                                    setData("date_format", e.target.value)
                                }
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                        <InputError
                            message={errors.date_format}
                            className="mt-2"
                        />
                    </div>

                    {/* Éléments par page */}
                    <div>
                        <InputLabel
                            htmlFor="items_per_page"
                            value="Éléments par page"
                        />
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <List className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="items_per_page"
                                name="items_per_page"
                                value={data.items_per_page}
                                onChange={(e) =>
                                    setData(
                                        "items_per_page",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <InputError
                            message={errors.items_per_page}
                            className="mt-2"
                        />
                    </div>

                    {/* Bouton de sauvegarde */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-2">
                        {recentlySuccessful && (
                            <p className="text-sm text-green-600 text-center sm:text-left">
                                Paramètres enregistrés.
                            </p>
                        )}
                        <PrimaryButton
                            disabled={processing}
                            className="w-full sm:w-auto justify-center"
                        >
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Enregistrer les modifications
                            </span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
