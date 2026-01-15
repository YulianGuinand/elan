import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { UserSettings } from "@/types/settings";
import { useForm } from "@inertiajs/react";
import { Mail } from "lucide-react";
import { FormEventHandler } from "react";

interface AccountSettingsProps {
    user: UserSettings;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
    // Séparer le nom complet en prénom et nom
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: firstName,
            last_name: lastName,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("settings.account.update"));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <InputLabel htmlFor="first_name" value="Prénom" />
                        <TextInput
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={data.first_name}
                            className="mt-2 block w-full"
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.first_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="last_name" value="Nom" />
                        <TextInput
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={data.last_name}
                            className="mt-2 block w-full"
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.last_name}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Adresse email */}
                <div>
                    <InputLabel htmlFor="email" value="Adresse email" />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />

                    {user.email_verified_at === null && (
                        <p className="mt-2 text-sm text-orange-600">
                            Votre adresse email n'est pas vérifiée.{" "}
                            <a
                                href={route("verification.send")}
                                className="underline hover:text-orange-800"
                            >
                                Renvoyer le lien de vérification
                            </a>
                        </p>
                    )}
                </div>

                {/* Bouton de sauvegarde */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-2">
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 text-center sm:text-left">
                            Modifications enregistrées.
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
