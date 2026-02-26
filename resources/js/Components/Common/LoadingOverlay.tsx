import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { LogoSvg } from "../LogoSvg";

export default function LoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const startHandler = () => setIsLoading(true);
        const finishHandler = () => setIsLoading(false);

        const removeStart = router.on("start", startHandler);
        const removeFinish = router.on("finish", finishHandler);

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeIn">
            <div className="flex flex-col items-center gap-6">
                {/* Logo animé - Taille responsive */}
                <div className="w-48 sm:w-56 md:w-64 lg:w-72">
                    <LogoSvg />
                </div>

                <div className="text-center">
                    <p className="text-sm font-medium text-elan-orange">
                        Chargement...
                    </p>
                </div>
            </div>
        </div>
    );
}
