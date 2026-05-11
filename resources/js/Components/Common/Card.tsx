import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg";
}

export default function Card({
    children,
    className = "",
    padding = "md",
}: CardProps) {
    const paddingClasses = {
        sm: "p-3 sm:p-4",
        md: "p-4 sm:p-6",
        lg: "p-6 sm:p-8",
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm ${paddingClasses[padding]} ${className}`}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: ReactNode;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
