import { Link } from "@inertiajs/react";
import { Menu, Plus } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface HeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    actionButton?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    onMenuClick?: () => void;
}

export default function Header({
    title,
    breadcrumbs = [],
    actionButton,
    onMenuClick,
}: HeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Hamburger Menu Button (Mobile) */}
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    )}

                    <div className="flex-1 min-w-0">
                        {/* Breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <nav className="flex items-center gap-2 text-sm mb-2">
                                {breadcrumbs.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="text-elan-blue hover:text-elan-green transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">
                                                {item.label}
                                            </span>
                                        )}
                                        {index < breadcrumbs.length - 1 && (
                                            <span className="text-gray-400">
                                                ›
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        )}

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Action Button */}
                {actionButton && (
                    <button
                        onClick={actionButton.onClick}
                        className="bg-elan-orange hover:bg-elan-orange/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm text-sm sm:text-base flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">
                            {actionButton.label}
                        </span>
                        <span className="sm:hidden">Créer</span>
                    </button>
                )}
            </div>
        </div>
    );
}
