import { UserSettings } from "@/types/settings";

interface ProfileHeaderProps {
    user: UserSettings;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
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
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                            {initials}
                        </div>
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
            </div>
        </div>
    );
}
