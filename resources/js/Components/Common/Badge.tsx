import React from "react";

export type BadgeVariant =
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-elan-orange/10 text-elan-orange border-elan-orange/20",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
};

export default function Badge({
    children,
    variant = "primary",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
