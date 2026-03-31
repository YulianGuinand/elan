import { useEffect, useState } from "react";

/**
 * Hook pour récupérer le nombre de notifications non lues
 * Rafraîchit les données tous les 5 secondes
 */
export function useUnreadNotificationCount() {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(route("notifications.unread-count"), {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error("Error fetching unread notification count:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnreadCount();

        // Rafraîchir toutes les 5 secondes
        const interval = setInterval(fetchUnreadCount, 5000);

        return () => clearInterval(interval);
    }, []);

    return { unreadCount, isLoading };
}
