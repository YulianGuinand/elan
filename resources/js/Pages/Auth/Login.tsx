import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Lock, Mail } from "lucide-react";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bienvenue
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Connectez-vous à votre compte
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                        <p className="text-sm font-medium text-green-800">
                            {status}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Adresse email" />
                        <div className="relative mt-2">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 block w-full"
                                placeholder="vous@exemple.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="Mot de passe" />
                        <div className="relative mt-2">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="pl-10 block w-full"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </div>
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData(
                                        "remember",
                                        (e.target.checked || false) as false,
                                    )
                                }
                            />
                            <span className="text-sm text-gray-600">
                                Se souvenir de moi
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <PrimaryButton
                        className="w-full justify-center mt-6 py-3.5"
                        disabled={processing}
                    >
                        {processing ? "Connexion en cours..." : "Se connecter"}
                    </PrimaryButton>
                </form>

                {/* Footer Links */}
                <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-100">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-elan-blue hover:text-elan-green font-medium transition-colors"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
