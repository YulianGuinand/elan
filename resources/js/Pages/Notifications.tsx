import FadeIn from "@/Components/Animations/FadeIn";
import NotificationTable from "@/Components/Notifications/NotificationTable";
import PageHead from "@/Components/Seo/PageHead";
import Pagination from "@/Components/Surveys/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { Bell, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface NotificationsPageProps {
    notifications?: {
        data: Notification[];
        meta: PaginationMeta;
    };
    unreadCount: number;
    total: number;
    filters: {
        search: string;
        type: string;
        status: string;
    };
}

const notificationTypes = [
    { value: "all", label: "Tous les types" },
    { value: "email_notifications", label: "Notification Email" },
    { value: "survey_reminders", label: "Rappel Enquête" },
    { value: "response_alerts", label: "Alerte Réponse" },
    { value: "weekly_reports", label: "Rapport Hebdomadaire" },
    { value: "system_updates", label: "Mise à Jour Système" },
];

const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "unread", label: "Non lues" },
    { value: "read", label: "Lues" },
];

export default function Notifications({
    notifications,
    unreadCount,
    total,
    filters: initialFilters,
}: NotificationsPageProps) {
    const [selectedNotifications, setSelectedNotifications] = useState<
        Set<number>
    >(new Set());

    const [filters, setFilters] = useState({
        search: initialFilters.search,
        type: initialFilters.type,
        status: initialFilters.status,
    });

    const handleSelectNotification = (id: number) => {
        const newSelected = new Set(selectedNotifications);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedNotifications(newSelected);
    };

    const handleSelectAll = () => {
        if (!notifications?.data) return;
        if (selectedNotifications.size === notifications.data.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(
                new Set(notifications.data.map((n) => n.id)),
            );
        }
    };

    const handleApplyFilters = () => {
        router.get(route("notifications.index"), filters, {
            preserveState: true,
        });
    };

    const handleResetFilters = () => {
        setFilters({ search: "", type: "all", status: "all" });
        router.get(route("notifications.index"), {
            search: "",
            type: "all",
            status: "all",
        });
        setSelectedNotifications(new Set());
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("notifications.index"),
            { ...filters, page },
            { preserveState: true },
        );
    };

    const handleMarkAsRead = (notificationId: number) => {
        router.patch(
            route("notifications.mark-as-read", {
                notification: notificationId,
            }),
            {},
            {
                onSuccess: () => {
                    setSelectedNotifications(new Set());
                },
            },
        );
    };

    const handleDelete = (notificationId: number) => {
        if (
            confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")
        ) {
            router.delete(
                route("notifications.destroy", {
                    notification: notificationId,
                }),
                {
                    onSuccess: () => {
                        setSelectedNotifications(new Set());
                    },
                },
            );
        }
    };

    const handleDeleteMultiple = () => {
        if (selectedNotifications.size === 0) return;

        const count = selectedNotifications.size;
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer ${count} notification${count > 1 ? "s" : ""} ?`,
            )
        ) {
            router.post(route("notifications.bulk-destroy"), {
                ids: Array.from(selectedNotifications),
            });
        }
    };

    const handleMarkAllAsRead = () => {
        router.patch(
            route("notifications.mark-all-as-read"),
            {},
            {
                onSuccess: () => {
                    setSelectedNotifications(new Set());
                },
            },
        );
    };

    return (
        <>
            <PageHead
                title="Notifications"
                description="Gérez vos notifications. Suivez les mises à jour de vos enquêtes, réponses et événements importants."
                keywords="notifications, alertes enquête, suivi"
            />

            <DashboardLayout
                title="Notifications"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Notifications" },
                ]}
            >
                <div className="space-y-6 mb-24 w-full">
                    {/* Header */}
                    <FadeIn delay={0}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Bell className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {total} notification
                                        {total > 1 ? "s" : ""}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {unreadCount > 0
                                            ? `${unreadCount} non lue${
                                                  unreadCount > 1 ? "s" : ""
                                              }`
                                            : "Toutes lues"}
                                    </p>
                                </div>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                    </FadeIn>

                    {/* Filtres */}
                    <FadeIn delay={100}>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                            <div className="flex flex-col w-full sm:flex-row gap-3 items-end">
                                {/* Recherche */}
                                <div className="flex-1 min-w-[200px] w-full">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Recherche
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Titre ou message..."
                                            value={filters.search}
                                            onChange={(e) =>
                                                setFilters((f) => ({
                                                    ...f,
                                                    search: e.target.value,
                                                }))
                                            }
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="flex-1 min-w-[150px] w-full">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {notificationTypes.map((t) => (
                                            <option
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Statut */}
                                <div className="flex-1 min-w-[150px] w-full">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Statut
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {statusOptions.map((s) => (
                                            <option
                                                key={s.value}
                                                value={s.value}
                                            >
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Boutons */}
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleApplyFilters}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                    >
                                        Appliquer
                                    </button>
                                    <button
                                        onClick={handleResetFilters}
                                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Table */}
                    <FadeIn delay={200}>
                        {/* Barre d'actions rapides */}
                        {selectedNotifications.size > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                                <p className="text-sm text-blue-900 font-medium">
                                    {selectedNotifications.size} notification
                                    {selectedNotifications.size > 1 ? "s" : ""}{" "}
                                    sélectionnée
                                    {selectedNotifications.size > 1 ? "s" : ""}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteMultiple}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedNotifications(new Set())
                                        }
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Désélectionner tout
                                    </button>
                                </div>
                            </div>
                        )}

                        {notifications?.data ? (
                            <NotificationTable
                                notifications={notifications.data}
                                selectedNotifications={selectedNotifications}
                                onSelectAll={handleSelectAll}
                                onSelectOne={handleSelectNotification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">
                                    Aucune notification trouvée
                                </p>
                            </div>
                        )}
                    </FadeIn>

                    {/* Pagination */}
                    {notifications?.meta &&
                        notifications.meta.last_page > 1 && (
                            <FadeIn delay={300}>
                                <Pagination
                                    currentPage={
                                        notifications.meta.current_page
                                    }
                                    totalPages={notifications.meta.last_page}
                                    totalItems={notifications.meta.total}
                                    itemsPerPage={notifications.meta.per_page}
                                    onPageChange={handlePageChange}
                                />
                            </FadeIn>
                        )}
                </div>
            </DashboardLayout>
        </>
    );
}
