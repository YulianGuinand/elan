import { PaginationMeta } from "@/types/students";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
    const { current_page, last_page, from, to, total } = meta;

    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (last_page <= maxVisible + 2) {
            // Afficher toutes les pages si peu de pages
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Toujours afficher la première page
            pages.push(1);

            if (current_page > 3) {
                pages.push("...");
            }

            // Pages autour de la page actuelle
            const start = Math.max(2, current_page - 1);
            const end = Math.min(last_page - 1, current_page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current_page < last_page - 2) {
                pages.push("...");
            }

            // Toujours afficher la dernière page
            pages.push(last_page);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200">
            {/* Texte d'information */}
            <div className="text-sm text-gray-600 order-2 sm:order-1">
                Affichage de{" "}
                <span className="font-medium text-gray-900">{from}</span> à{" "}
                <span className="font-medium text-gray-900">{to}</span> sur{" "}
                <span className="font-medium text-gray-900">{total}</span>{" "}
                apprenants
            </div>

            {/* Navigation de pagination */}
            <nav className="flex items-center gap-1 order-1 sm:order-2">
                {/* Bouton Précédent */}
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                {/* Numéros de page */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-3 py-2 text-gray-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === current_page;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-elan-orange text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Bouton Suivant */}
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page suivante"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </nav>
        </div>
    );
}
