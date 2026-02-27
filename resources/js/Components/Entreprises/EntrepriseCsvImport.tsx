import { FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function EntrepriseCsvImport() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFile = (file: File) => {
        setSelectedFile(file);
        // Injecter manuellement le fichier dans l'input caché
        if (fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                    Importation CSV / Excel
                </h2>
                <p className="text-sm text-gray-500">
                    Importez plusieurs entreprises en une seule fois en
                    téléchargeant votre fichier .CSV ou .XLSX.
                </p>
            </div>

            {/*
             * Formulaire HTML natif (non-AJAX) pour que dd() s'affiche
             * correctement dans le navigateur.
             */}
            <form
                ref={formRef}
                method="POST"
                action={route("entreprises.import")}
                encType="multipart/form-data"
            >
                {/* Token CSRF */}
                <input
                    type="hidden"
                    name="_token"
                    value={
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content ?? ""
                    }
                />

                {/* Zone de dépôt */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        dragging
                            ? "border-orange-400 bg-orange-50"
                            : selectedFile
                              ? "border-green-400 bg-green-50"
                              : "border-orange-300 bg-orange-50 hover:bg-orange-100"
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="fichier"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleInputChange}
                    />

                    {selectedFile ? (
                        <>
                            <FileSpreadsheet className="w-12 h-12 text-green-500 mb-3" />
                            <p className="text-sm font-semibold text-green-700">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {(selectedFile.size / 1024).toFixed(1)} Ko —{" "}
                                {selectedFile.type || "fichier"}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Cliquer pour changer de fichier
                            </p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-orange-400 mb-3" />
                            <p className="text-sm font-semibold text-gray-700">
                                Glissez-déposez votre fichier
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Format accepté : .CSV, .XLSX (Max 10 Mo)
                            </p>
                            <span className="mt-3 text-xs font-medium text-orange-500 underline underline-offset-2">
                                ou parcourir vos fichiers
                            </span>
                        </>
                    )}
                </div>

                {/* Boutons */}
                <div className="flex items-center justify-between mt-4">
                    <a
                        href={route("entreprises.exemple")}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Télécharger le modèle CSV
                    </a>

                    <button
                        type="submit"
                        disabled={!selectedFile}
                        className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        Importer les entreprises
                    </button>
                </div>
            </form>

            {/* Instructions colonnes */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                    Structure attendue du fichier
                </p>
                <div className="overflow-x-auto">
                    <table className="text-xs text-gray-600 w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-1 pr-4 font-semibold text-gray-500">
                                    Colonne
                                </th>
                                <th className="text-left py-1 font-semibold text-gray-500">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                ["raison_sociale *", "Nom de l'entreprise"],
                                ["siret", "Numéro SIRET (14 chiffres)"],
                                ["secteur", "Secteur d'activité"],
                                ["taille", "tpe / pme / eti / ge"],
                                ["mail", "Email de contact"],
                                ["telephone", "Téléphone"],
                                ["interlocuteur", "Nom du contact principal"],
                                ["fonction", "Poste du contact"],
                                ["ville", "Ville du siège"],
                                ["adresse", "Adresse complète"],
                                ["code_postal", "Code postal"],
                            ].map(([col, desc]) => (
                                <tr key={col}>
                                    <td className="py-1 pr-4 font-mono text-orange-600">
                                        {col}
                                    </td>
                                    <td className="py-1">{desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
