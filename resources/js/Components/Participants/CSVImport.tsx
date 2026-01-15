import Badge from "@/Components/Common/Badge";
import PrimaryButton from "@/Components/PrimaryButton";
import { CSVError, Participant } from "@/types/participant";
import {
    ChevronDown,
    ChevronUp,
    Download,
    FileText,
    HelpCircle,
    Upload,
} from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import FileDropZone from "./FileDropZone";

interface CSVImportProps {
    onImport: (participants: Participant[]) => void;
    isImporting?: boolean;
}

export default function CSVImport({
    onImport,
    isImporting = false,
}: CSVImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<Participant[]>([]);
    const [errors, setErrors] = useState<CSVError[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const handleFileAccepted = (acceptedFile: File) => {
        setFile(acceptedFile);
        parseCSV(acceptedFile);
    };

    const parseCSV = (csvFile: File) => {
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];
                const participants: Participant[] = [];
                const parseErrors: CSVError[] = [];

                data.forEach((row, index) => {
                    const participant: Participant = {
                        prenom: row.prenom || row.Prénom || row.Prenom || "",
                        nom: row.nom || row.Nom || "",
                        email: row.email || row.Email || "",
                        telephone:
                            row.telephone ||
                            row.Téléphone ||
                            row.Telephone ||
                            "",
                        role: (row.role ||
                            row.Rôle ||
                            row.Role ||
                            "apprenant") as Participant["role"],
                        programme_formation:
                            row.programme_formation ||
                            row["Programme de formation"] ||
                            row.programme ||
                            "",
                    };

                    // Validation
                    if (!participant.prenom || participant.prenom.length < 2) {
                        parseErrors.push({
                            row: index + 1,
                            field: "prenom",
                            message: `Ligne ${index + 1}: Prénom invalide`,
                        });
                    }

                    if (!participant.nom || participant.nom.length < 2) {
                        parseErrors.push({
                            row: index + 1,
                            field: "nom",
                            message: `Ligne ${index + 1}: Nom invalide`,
                        });
                    }

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (
                        !participant.email ||
                        !emailRegex.test(participant.email)
                    ) {
                        parseErrors.push({
                            row: index + 1,
                            field: "email",
                            message: `Ligne ${index + 1}: Email invalide`,
                        });
                    }

                    if (
                        ![
                            "apprenant",
                            "tuteur",
                            "formateur",
                            "employeur",
                        ].includes(participant.role)
                    ) {
                        parseErrors.push({
                            row: index + 1,
                            field: "role",
                            message: `Ligne ${
                                index + 1
                            }: Rôle invalide (doit être: apprenant, tuteur, formateur ou employeur)`,
                        });
                    }

                    participants.push(participant);
                });

                setParsedData(participants);
                setErrors(parseErrors);
                setShowPreview(true);
            },
            error: (error) => {
                setErrors([
                    { row: 0, message: `Erreur de parsing: ${error.message}` },
                ]);
            },
        });
    };

    const handleImport = () => {
        if (parsedData.length > 0 && errors.length === 0) {
            onImport(parsedData);
            // Reset
            setFile(null);
            setParsedData([]);
            setShowPreview(false);
        }
    };

    const downloadTemplate = () => {
        const template = `prenom,nom,email,telephone,role,programme_formation
Jean,Dupont,jean.dupont@exemple.fr,0612345678,apprenant,BTS Management Commercial Opérationnel
Marie,Martin,marie.martin@exemple.fr,0623456789,tuteur,`;

        const blob = new Blob([template], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "modele_participants.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            {/* Badge */}
            <Badge variant="info" className="text-xs font-semibold uppercase">
                Importation par lot
            </Badge>

            {/* Format Guide Toggle */}
            <button
                onClick={() => setShowGuide(!showGuide)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                        Comment formater mon fichier CSV ?
                    </span>
                </div>
                {showGuide ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                )}
            </button>

            {/* Format Guide Content */}
            {showGuide && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Format requis
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Votre fichier CSV doit contenir les colonnes
                            suivantes (dans n&apos;importe quel ordre) :
                        </p>
                    </div>

                    {/* Required columns */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r">
                                        Colonne
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r">
                                        Obligatoire
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r">
                                        Format
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                        Exemple
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        prenom
                                    </td>
                                    <td className="px-3 py-2 text-red-600 border-r">
                                        ✓ Oui
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Texte
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                        Jean
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        nom
                                    </td>
                                    <td className="px-3 py-2 text-red-600 border-r">
                                        ✓ Oui
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Texte
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                        Dupont
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        email
                                    </td>
                                    <td className="px-3 py-2 text-red-600 border-r">
                                        ✓ Oui
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Email valid
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                        jean.dupont@exemple.fr
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        telephone
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Non
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        10 chiffres
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                        0612345678
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        role
                                    </td>
                                    <td className="px-3 py-2 text-red-600 border-r">
                                        ✓ Oui
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r text-xs">
                                        apprenant, tuteur, formateur, employeur
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                        apprenant
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-3 py-2 font-mono text-gray-900 border-r">
                                        programme_formation
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Non
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 border-r">
                                        Texte
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                                        BTS MCO
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Example */}
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-green-400 mb-1">
                            # Exemple de contenu CSV
                        </div>
                        <div>
                            prenom,nom,email,telephone,role,programme_formation
                        </div>
                        <div>
                            Jean,Dupont,jean.dupont@exemple.fr,0612345678,apprenant,BTS
                            MCO
                        </div>
                        <div>
                            Marie,Martin,marie.m@exemple.fr,0623456789,tuteur,
                        </div>
                    </div>

                    {/* Download template button */}
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-900">
                                Téléchargez le modèle
                            </p>
                            <p className="text-xs text-green-700">
                                Utilisez notre fichier exemple pré-formaté
                            </p>
                        </div>
                        <button
                            onClick={downloadTemplate}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors flex items-center gap-1 flex-shrink-0"
                        >
                            <Download className="w-3 h-3" />
                            Télécharger
                        </button>
                    </div>
                </div>
            )}

            {/* Drop Zone */}
            <FileDropZone onFileAccepted={handleFileAccepted} />

            {/* Preview Section */}
            {showPreview && parsedData.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-700">
                            APERÇU DES DONNÉES
                            <span className="ml-2 text-xs text-gray-500">
                                ({parsedData.length} participant
                                {parsedData.length > 1 ? "s" : ""})
                            </span>
                        </span>
                        {showPreview ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                    </button>

                    {showPreview && (
                        <div className="p-4 max-h-64 overflow-y-auto">
                            {errors.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-red-600">
                                        {errors.length} erreur
                                        {errors.length > 1 ? "s" : ""} détectée
                                        {errors.length > 1 ? "s" : ""}
                                    </p>
                                    <ul className="space-y-1">
                                        {errors.map((error, index) => (
                                            <li
                                                key={index}
                                                className="text-xs text-red-600"
                                            >
                                                • {error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-green-600">
                                        ✓ Toutes les données sont valides
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-xs">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-700">
                                                        Prénom
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-700">
                                                        Nom
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-700">
                                                        Email
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-700">
                                                        Rôle
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {parsedData
                                                    .slice(0, 5)
                                                    .map(
                                                        (
                                                            participant,
                                                            index
                                                        ) => (
                                                            <tr key={index}>
                                                                <td className="px-3 py-2 text-gray-900">
                                                                    {
                                                                        participant.prenom
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-900">
                                                                    {
                                                                        participant.nom
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-600">
                                                                    {
                                                                        participant.email
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <Badge
                                                                        variant="info"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            participant.role
                                                                        }
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                        {parsedData.length > 5 && (
                                            <p className="mt-2 text-xs text-gray-500 text-center">
                                                ... et {parsedData.length - 5}{" "}
                                                autre
                                                {parsedData.length - 5 > 1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                        )}
                                    </div>

                                    <PrimaryButton
                                        onClick={handleImport}
                                        disabled={isImporting}
                                        className="w-full justify-center"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isImporting
                                            ? "Importation..."
                                            : `Importer ${
                                                  parsedData.length
                                              } participant${
                                                  parsedData.length > 1
                                                      ? "s"
                                                      : ""
                                              }`}
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!file && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                        Aucun fichier sélectionné
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        L&apos;aperçu de vos données apparaîtra ici après
                        l&apos;upload
                    </p>
                </div>
            )}
        </div>
    );
}
