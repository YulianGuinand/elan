import {
    GeneralSettings as GeneralSettingsType,
    UserSettings,
} from "@/types/settings";
import { Calendar, Mail, User } from "lucide-react";

interface GeneralSettingsProps {
    settings: GeneralSettingsType;
    user: UserSettings;
}

const formatDate = (date: string | null) => {
    if (!date) return "Non disponible";
    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function GeneralSettings({
    settings,
    user,
}: GeneralSettingsProps) {
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Informations du compte */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">
                    Informations du compte
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-600">Rôle</p>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {user.role}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-600">Email</p>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {user.email}
                        </p>
                    </div>

                    {/* Date de création */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-600">
                                Date de création
                            </p>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDate(user.created_at)}
                        </p>
                    </div>

                    {/* Date de dernière modification */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-600">
                                Dernière modification
                            </p>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDate(user.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
