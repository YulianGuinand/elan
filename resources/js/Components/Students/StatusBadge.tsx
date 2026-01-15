import { StudentStatus } from "@/types/students";

interface StatusBadgeProps {
    status: StudentStatus;
}

const statusConfig = {
    active: {
        label: "Actif",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    graduated: {
        label: "Diplômé",
        color: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
    paused: {
        label: "En Pause",
        color: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
    },
    suspended: {
        label: "Suspendu",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
}
