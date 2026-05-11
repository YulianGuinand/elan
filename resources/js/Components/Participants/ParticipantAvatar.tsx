interface ParticipantAvatarProps {
    prenom: string;
    nom: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
};

// Fonction pour générer une couleur cohérente basée sur le nom
function getColorFromName(name: string): string {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-teal-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
    ];

    const hash = name.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
}

export default function ParticipantAvatar({
    prenom,
    nom,
    size = "md",
    className = "",
}: ParticipantAvatarProps) {
    const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    const bgColor = getColorFromName(`${prenom}${nom}`);

    return (
        <div
            className={`
        ${sizeClasses[size]}
        ${bgColor}
        rounded-full flex items-center justify-center text-white font-semibold
        flex-shrink-0
        ${className}
      `}
        >
            {initials}
        </div>
    );
}
