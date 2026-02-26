import { UserSettings } from "@/types/settings";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
    user: UserSettings;
    onPhotoChange?: () => void;
}

export default function ProfileHeader({
    user,
    onPhotoChange,
}: ProfileHeaderProps) {
    // Générer les initiales si pas d'avatar
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Profil utilisateur
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* Informations utilisateur */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {user.name}
                        </h3>
                        <p className="text-sm font-medium text-elan-orange">
                            {user.role}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Bouton changer la photo */}
                {onPhotoChange && (
                    <button
                        onClick={onPhotoChange}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <Camera className="w-4 h-4" />
                        Changer la photo
                    </button>
                )}
            </div>
        </div>
    );
}
