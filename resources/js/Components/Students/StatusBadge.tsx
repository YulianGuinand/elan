interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<
    string,
    { label: string; color: string; dot: string }
> = {
    actif: {
        label: "Actif",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    diplome: {
        label: "Diplômé",
        color: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
    suspendu: {
        label: "Suspendu",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    abandon: {
        label: "Abandon",
        color: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        color: "bg-gray-100 text-gray-700",
        dot: "bg-gray-500",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
}
