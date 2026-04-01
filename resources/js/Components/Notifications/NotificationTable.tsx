import { CheckCircle, FileText, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface NotificationTableProps {
    notifications: Notification[];
    selectedNotifications: Set<number>;
    onSelectAll: () => void;
    onSelectOne: (id: number) => void;
    onMarkAsRead: (id: number) => void;
    onDelete: (id: number) => void;
}

const notificationTypeLabels: Record<string, { label: string; color: string }> =
    {
        email_notifications: {
            label: "Notification Email",
            color: "bg-blue-100 text-blue-800",
        },
        survey_reminders: {
            label: "Rappel Enquête",
            color: "bg-green-100 text-green-800",
        },
        response_alerts: {
            label: "Alerte Réponse",
            color: "bg-orange-100 text-orange-800",
        },
        weekly_reports: {
            label: "Rapport Hebdomadaire",
            color: "bg-purple-100 text-purple-800",
        },
        system_updates: {
            label: "Mise à Jour Système",
            color: "bg-gray-100 text-gray-800",
        },
    };

export default function NotificationTable({
    notifications,
    selectedNotifications,
    onSelectAll,
    onSelectOne,
    onMarkAsRead,
    onDelete,
}: NotificationTableProps) {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                !target.closest("[data-dropdown-id]") &&
                !target.closest("button")
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (notifications.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                    Aucune notification trouvée
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Essayez de modifier vos filtres
                </p>
            </div>
        );
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={
                                        notifications.length > 0 &&
                                        selectedNotifications.size ===
                                            notifications.length
                                    }
                                    onChange={onSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                />
                            </th>
                            {[
                                "Type",
                                "Titre",
                                "Message",
                                "Date",
                                "Statut",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {notifications.map((notification) => {
                            const typeInfo = notificationTypeLabels[
                                notification.type
                            ] || {
                                label: notification.type,
                                color: "bg-gray-100 text-gray-800",
                            };
                            const isSelected = selectedNotifications.has(
                                notification.id,
                            );
                            const isRead = notification.read_at !== null;

                            return (
                                <tr
                                    key={notification.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        isSelected ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                onSelectOne(notification.id)
                                            }
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                        />
                                    </td>

                                    {/* Type */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold truncate ${typeInfo.color}`}
                                        >
                                            {typeInfo.label}
                                        </span>
                                    </td>

                                    {/* Titre */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                                            {notification.title}
                                        </p>
                                    </td>

                                    {/* Message */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {notification.message}
                                        </p>
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(
                                                notification.created_at,
                                            )}
                                        </p>
                                    </td>

                                    {/* Statut */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                isRead
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    isRead
                                                        ? "bg-gray-400"
                                                        : "bg-blue-500"
                                                }`}
                                            />
                                            {isRead ? "Lue" : "Non lue"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4 flex justify-center">
                                        <div
                                            className="relative inline-block"
                                            data-dropdown-id={notification.id}
                                        >
                                            <button
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown ===
                                                            notification.id
                                                            ? null
                                                            : notification.id,
                                                    )
                                                }
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Actions"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                                            </button>

                                            {openDropdown ===
                                                notification.id && (
                                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                    {!isRead && (
                                                        <button
                                                            onClick={() => {
                                                                onMarkAsRead(
                                                                    notification.id,
                                                                );
                                                                setOpenDropdown(
                                                                    null,
                                                                );
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2 border-b border-gray-100"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Marquer comme lue
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            onDelete(
                                                                notification.id,
                                                            );
                                                            setOpenDropdown(
                                                                null,
                                                            );
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
