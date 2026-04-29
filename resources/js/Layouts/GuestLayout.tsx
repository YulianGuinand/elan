import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            {/* Logo Section */}
            <div className="mb-4">
                <Link href="/" className="inline-flex items-center gap-3">
                    <div className="w-48">
                        <img
                            src="/logo.svg"
                            alt="Logo de Elan"
                            className="w-full"
                        />
                    </div>
                </Link>
            </div>

            {/* Form Container */}
            <div className="w-full overflow-hidden bg-white px-6 py-8 border sm:max-w-md sm:rounded-2xl">
                <div className="relative pt-4">{children}</div>
            </div>

            {/* Footer hint */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Plateforme de gestion d'enquêtes</p>
            </div>
        </div>
    );
}
