import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: "left" | "right";
    direction?: "up" | "down";
    className?: string; // Not used on portal, but kept for compatibility
    index?: number;
}

export default function DropdownMenu({
    trigger,
    children,
    align = "right",
    direction,
    index = 0,
}: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();

            let topPosition;
            // Logic:
            // 1. If direction is explicit, use it
            // 2. Else if index >= 2, open upwards
            // 3. Default downwards

            const shouldOpenUp =
                direction === "up" || (!direction && index >= 2);

            if (shouldOpenUp) {
                // Open upwards
                topPosition = rect.top;
            } else {
                // Open downwards
                topPosition = rect.bottom + 4;
            }

            const leftPosition = rect.right;

            setCoords({ top: topPosition, left: leftPosition });
        }
    }, [isOpen, index]);

    useEffect(() => {
        if (!isOpen) return;
        const handleScroll = () => setIsOpen(false);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    return (
        <>
            <div
                ref={triggerRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="relative inline-block w-full"
            >
                {trigger}
            </div>

            {isOpen &&
                createPortal(
                    <>
                        {/* Backdrop to handle click outside */}
                        <div
                            className="fixed inset-0 z-[99998] cursor-default"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Content */}
                        <div
                            className="fixed z-[99999] bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] animate-fadeIn"
                            style={{
                                ...(direction === "up" ||
                                (!direction && index >= 2)
                                    ? {
                                          bottom: `${
                                              window.innerHeight -
                                              coords.top +
                                              4
                                          }px`,
                                          top: "auto",
                                      }
                                    : {
                                          top: `${coords.top}px`,
                                          bottom: "auto",
                                      }),
                                // Align right edge of menu to right edge of trigger
                                left: "auto",
                                right: `${window.innerWidth - coords.left}px`,
                            }}
                        >
                            {children}
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
}

interface DropdownItemProps {
    onClick: () => void;
    icon?: ReactNode;
    children: ReactNode;
    danger?: boolean;
    className?: string;
}

export function DropdownItem({
    onClick,
    icon,
    children,
    danger = false,
    className = "",
}: DropdownItemProps) {
    const baseClasses =
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left";
    const colorClasses = danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-50";

    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling
                onClick();
            }}
            className={`${baseClasses} ${colorClasses} ${className}`}
        >
            {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
            <span className="truncate">{children}</span>
        </button>
    );
}

export function DropdownDivider() {
    return <div className="border-t border-gray-200 my-1" />;
}
