import { Link } from "@inertiajs/react";
import { X } from "lucide-react";
import DashboardIcon from "./icons/DashboardIcon";
import ReportIcon from "./icons/ReportIcon";
import SettingsIcon from "./icons/SettingsIcon";
import StudentIcon from "./icons/StudentIcon";
import SurveyIcon from "./icons/SurveyIcon";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    routeName: string;
}

const navigationItems: NavItem[] = [
    {
        name: "Tableau de bord",
        href: "/dashboard",
        icon: DashboardIcon,
        routeName: "dashboard",
    },
    {
        name: "Enquêtes",
        href: "/surveys",
        icon: SurveyIcon,
        routeName: "surveys",
    },
    {
        name: "Étudiants",
        href: "/students",
        icon: StudentIcon,
        routeName: "students",
    },
    {
        name: "Rapports",
        href: "/reports",
        icon: ReportIcon,
        routeName: "reports",
    },
    {
        name: "Paramètres",
        href: "/settings",
        icon: SettingsIcon,
        routeName: "settings",
    },
];

interface SidebarProps {
    userName?: string;
    userRole?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({
    userName = "Jean Pierre",
    userRole = "Admin",
    isOpen,
    onClose,
}: SidebarProps) {
    const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/dashboard";

    return (
        <>
            {/* Overlay pour mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
                    flex flex-col z-50 transition-transform duration-300 ease-in-out
                    w-64
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* Bouton de fermeture (mobile uniquement) */}
                <div className="lg:hidden absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Logo and Title */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-elan-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            CFA
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">
                                Admin CFA
                            </h1>
                            <p className="text-xs text-gray-500">
                                Centre de Formation
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const isActive = currentPath === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-elan-orange text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${
                                        isActive
                                            ? "text-white"
                                            : "text-gray-500"
                                    }`}
                                />
                                <span className="font-medium text-sm">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                            {userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500">{userRole}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
