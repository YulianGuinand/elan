import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import { Link, router } from "@inertiajs/react";
import { ChevronUp, LogOut, Settings, X } from "lucide-react";
import DashboardIcon from "./icons/DashboardIcon";
import EntrepriseIcon from "./icons/EntrepriseIcon";
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
        href: "/tableau-de-bord",
        icon: DashboardIcon,
        routeName: "dashboard",
    },
    {
        name: "Enquêtes",
        href: "/enquetes",
        icon: SurveyIcon,
        routeName: "surveys.index",
    },
    {
        name: "Participants",
        href: "/participants",
        icon: StudentIcon,
        routeName: "participants.index",
    },
    {
        name: "Entreprises",
        href: "/entreprises",
        icon: EntrepriseIcon,
        routeName: "entreprises.index",
    },
    {
        name: "Rapports",
        href: "/rapports",
        icon: ReportIcon,
        routeName: "reports.index",
    },
    {
        name: "Paramètres",
        href: "/parametres",
        icon: SettingsIcon,
        routeName: "settings.index",
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

    const handleLogout = () => {
        if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            router.post(route("logout"));
        }
    };

    return (
        <>
            {/* Overlay pour mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo + Close button */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo-icon.svg"
                            alt="Élan Logo"
                            className="w-8 h-8"
                        />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Élan
                            </h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Administration
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href;

                        return (
                            <Link
                                key={item.routeName}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-elan-orange text-white shadow-md"
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
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <DropdownMenu
                        direction="up"
                        trigger={
                            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                                    {userName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {userRole}
                                    </p>
                                </div>
                                <ChevronUp className="w-4 h-4 text-gray-500 transition-transform" />
                            </button>
                        }
                    >
                        <DropdownItem
                            onClick={() => {
                                router.get(route("settings.index"));
                                onClose();
                            }}
                            icon={
                                <Settings className="w-4 h-4 text-gray-500" />
                            }
                        >
                            Profil
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                            onClick={handleLogout}
                            icon={<LogOut className="w-4 h-4" />}
                            danger
                        >
                            Se déconnecter
                        </DropdownItem>
                    </DropdownMenu>
                </div>
            </aside>
        </>
    );
}
