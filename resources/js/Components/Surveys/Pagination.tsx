import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Affichage des résultats */}
                <p className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">{startItem}</span> à{" "}
                    <span className="font-medium">{endItem}</span> sur{" "}
                    <span className="font-medium">{totalItems}</span> résultats
                </p>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                    {/* Bouton Précédent */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Numéros de page */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    typeof page === "number" &&
                                    onPageChange(page)
                                }
                                disabled={page === "..."}
                                className={`
                                    min-w-[40px] h-10 px-3 rounded-lg font-medium text-sm transition-colors
                                    ${
                                        page === currentPage
                                            ? "bg-elan-orange text-white"
                                            : page === "..."
                                            ? "cursor-default text-gray-400"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Bouton Suivant */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
