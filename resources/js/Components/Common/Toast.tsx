import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const toastConfig: Record<
    ToastType,
    {
        icon: React.ReactNode;
        bg: string;
        text: string;
        border: string;
        progress: string;
    }
> = {
    success: {
        icon: <CheckCircle className="w-5 h-5 shrink-0" />,
        bg: "bg-white",
        text: "text-green-700",
        border: "border-l-4 border-green-500",
        progress: "bg-green-500",
    },
    error: {
        icon: <XCircle className="w-5 h-5 shrink-0" />,
        bg: "bg-white",
        text: "text-red-700",
        border: "border-l-4 border-red-500",
        progress: "bg-red-500",
    },
    info: {
        icon: <Info className="w-5 h-5 shrink-0" />,
        bg: "bg-white",
        text: "text-blue-700",
        border: "border-l-4 border-blue-500",
        progress: "bg-blue-500",
    },
};

function ToastItem({
    toast,
    onRemove,
}: {
    toast: Toast;
    onRemove: (id: string) => void;
}) {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const config = toastConfig[toast.type];
    const DURATION = 4000;

    useEffect(() => {
        // Trigger enter animation
        const enterTimeout = setTimeout(() => setVisible(true), 10);
        // Auto-dismiss
        const dismissTimeout = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, DURATION);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(dismissTimeout);
        };
    }, []);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div
            className={`
                relative flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg
                ${config.bg} ${config.border}
                min-w-[280px] max-w-sm overflow-hidden
                transition-all duration-300
                ${visible && !exiting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
            `}
        >
            {/* Icône */}
            <span className={`mt-0.5 ${config.text}`}>{config.icon}</span>

            {/* Message */}
            <p className={`flex-1 text-sm font-medium ${config.text} pr-4`}>
                {toast.message}
            </p>

            {/* Bouton fermer */}
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Barre de progression */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                <div
                    className={`h-full ${config.progress} origin-left`}
                    style={{
                        animation: `toast-progress ${DURATION}ms linear forwards`,
                    }}
                />
            </div>
        </div>
    );
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
}

// Hook utilitaire
export function useToastManager() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const add = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, type, message }]);
    };

    const remove = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return { toasts, add, remove };
}
