import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import LoadingOverlay from "./Components/Common/LoadingOverlay";

const appName = import.meta.env.VITE_APP_NAME || "Elan";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <LoadingOverlay />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: "#F18628", // Couleur orange ELAN
        showSpinner: false, // Pas de spinner (on utilise notre overlay)
        delay: 10, // Délai avant d'afficher la barre (ms)
    },
});
