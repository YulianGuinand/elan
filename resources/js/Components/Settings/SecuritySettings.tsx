import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { UserSettings } from "@/types/settings";
import { useForm } from "@inertiajs/react";
import { Lock, Shield } from "lucide-react";
import { FormEventHandler } from "react";

interface SecuritySettingsProps {
    user: UserSettings;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
    const {
        data,
        setData,
        put,
        errors,
        processing,
        recentlySuccessful,
        reset,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("settings.password.update"), {
            onSuccess: () => reset(),
        });
    };

    const toggle2FA = () => {
        // Logique pour activer/désactiver 2FA
        console.log("Toggle 2FA");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Sécurité
            </h3>

            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                {/* Authentification à deux facteurs */}
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Authentification à deux facteurs (2FA)
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {user.two_factor_enabled
                                        ? "La 2FA est activée pour votre compte. Votre compte est mieux protégé."
                                        : "Ajoutez une couche de sécurité supplémentaire à votre compte."}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={toggle2FA}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                                user.two_factor_enabled
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                        >
                            {user.two_factor_enabled ? "Désactiver" : "Activer"}
                        </button>
                    </div>
                </div>

                {/* Changer le mot de passe */}
                <div className="space-y-4">
                    <div>
                        <InputLabel
                            htmlFor="current_password"
                            value="Mot de passe actuel"
                        />
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="current_password"
                                type="password"
                                name="current_password"
                                value={data.current_password}
                                className="block w-full pl-10"
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                            />
                        </div>
                        <InputError
                            message={errors.current_password}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Nouveau mot de passe"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmer le mot de passe"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-2">
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 text-center sm:text-left">
                            Mot de passe mis à jour.
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
    );
}
