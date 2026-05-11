import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

/**
 * Hook qui effectue un refrais automatique de la page
 * une seule fois après la première connexion de l'utilisateur.
 * Cela garantit que le jeton CSRF est frais et valide.
 */
export default function useRefreshOnLogin() {
    const { props } = usePage();
    const auth = props.auth as any;

    useEffect(() => {
        // Vérifie si l'utilisateur est authentifié
        if (!auth?.user) return;

        // Clé pour tracker si on a déjà rafraîchi après cette session
        const storageKey = `refreshed_after_login_${auth.user.id}`;
        const hasRefreshed = sessionStorage.getItem(storageKey);

        // Si on n'a pas encore rafraîchi, on refrais la page une fois
        if (!hasRefreshed) {
            sessionStorage.setItem(storageKey, "true");
            window.location.reload();
        }
    }, [auth?.user?.id, auth?.user]);
}
