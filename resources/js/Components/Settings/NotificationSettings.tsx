import PrimaryButton from "@/Components/PrimaryButton";
import { NotificationPreferences } from "@/types/settings";
import { useForm } from "@inertiajs/react";
import { AlertCircle, BarChart3, Bell, Mail, RefreshCw } from "lucide-react";
import { FormEventHandler } from "react";

interface NotificationSettingsProps {
    preferences: NotificationPreferences;
}

interface NotificationOption {
    id: keyof NotificationPreferences;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const notificationOptions: NotificationOption[] = [
    {
        id: "email_notifications",
        label: "Notifications par email",
        description: "Recevoir des emails pour les événements importants",
        icon: Mail,
    },
    {
        id: "survey_reminders",
        label: "Rappels d'enquêtes",
        description: "Rappels pour les enquêtes en cours et à venir",
        icon: Bell,
    },
    {
        id: "response_alerts",
        label: "Alertes de réponses",
        description: "Être notifié lorsque de nouvelles réponses arrivent",
        icon: AlertCircle,
    },
    {
        id: "weekly_reports",
        label: "Rapports hebdomadaires",
        description: "Recevoir un résumé hebdomadaire de l'activité",
        icon: BarChart3,
    },
    {
        id: "system_updates",
        label: "Mises à jour système",
        description:
            "Notifications sur les nouvelles fonctionnalités et mises à jour",
        icon: RefreshCw,
    },
];

export default function NotificationSettings({
    preferences,
}: NotificationSettingsProps) {
    const { data, setData, patch, processing, recentlySuccessful } =
        useForm(preferences);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("settings.notifications.update"));
    };

    const handleToggle = (key: keyof NotificationPreferences) => {
        setData(key, !data[key]);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Notifications
            </h2>

            <form onSubmit={submit} className="space-y-3 sm:space-y-4">
                {notificationOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <div
                            key={option.id}
                            className="flex items-start justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                        >
                            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                    <Icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {option.label}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={() => handleToggle(option.id)}
                                className={`
                                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-elan-orange focus:ring-offset-2
                                    ${
                                        data[option.id]
                                            ? "bg-elan-orange"
                                            : "bg-gray-200"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                                        transition duration-200 ease-in-out
                                        ${
                                            data[option.id]
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                        }
                                    `}
                                />
                            </button>
                        </div>
                    );
                })}

                {/* Bouton de sauvegarde */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 text-center sm:text-left">
                            Préférences enregistrées.
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
