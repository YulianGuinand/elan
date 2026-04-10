import InlineCreateModal, {
    EntityType,
} from "@/Components/Common/InlineCreateModal";
import { SelectOption } from "@/Components/Common/SearchableSelect";
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    GraduationCap,
    Landmark,
    Loader2,
    PlusCircle,
    Upload,
} from "lucide-react";
import { useRef, useState } from "react";

// ─── Types ─────────────────

interface PreviewRow {
    nom: string;
    prenom: string;
    mail: string;
    telephone: string | null;
    role: string;
    ecole: string | null;
    formation: string | null;
    entreprise: string | null;
    date_entree: string | null;
    date_sortiee: string | null;
}

interface PreviewData {
    rows: PreviewRow[];
    unknownEcoles: string[];
    unknownFormations: string[];
    unknownEntreprises: string[];
}

function EntityCell({
    value,
    isUnknown,
    isResolved,
}: {
    value: string | null;
    isUnknown: boolean;
    isResolved: boolean;
}) {
    if (!value) return <span className="text-gray-300">—</span>;
    if (isResolved)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 truncate">
                <CheckCircle2 className="w-3 h-3" />
                {value}
            </span>
        );
    if (isUnknown)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 truncate">
                <AlertCircle className="w-3 h-3" />
                {value}
            </span>
        );
    return <span className="text-gray-600 text-xs">{value}</span>;
}

function getCsrf(): string {
    return (
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
            ?.content ?? ""
    );
}

const roleBadge: Record<string, string> = {
    Apprenti: "bg-blue-100 text-blue-700",
    Alumni: "bg-green-100 text-green-700",
    Formateur: "bg-purple-100 text-purple-700",
    Employeur: "bg-orange-100 text-orange-700",
};

// ─── Composant principal ────

export default function StudentCsvImport() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [importOk, setImportOk] = useState(false);

    // Resolution des entites inconnues : nom → id cree
    const [resolvedEcoles, setResolvedEcoles] = useState<
        Record<string, number>
    >({});
    const [resolvedFormations, setResolvedFormations] = useState<
        Record<string, number>
    >({});
    const [resolvedEntreprises, setResolvedEntreprises] = useState<
        Record<string, number>
    >({});

    // Modal inline
    const [modalType, setModalType] = useState<EntityType | null>(null);
    const [modalDefault, setModalDefault] = useState("");
    const [modalContext, setModalContext] = useState<string>(""); // le nom d'origine

    // ── Gestion du fichier ──

    const handleFile = async (f: File) => {
        setFile(f);
        setPreview(null);
        setError(null);
        setImportOk(false);
        setResolvedEcoles({});
        setResolvedFormations({});
        setResolvedEntreprises({});
        await runPreview(f);
    };

    const runPreview = async (f: File) => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("fichier", f);
            fd.append("_token", getCsrf());

            const res = await fetch(route("participants.preview"), {
                method: "POST",
                body: fd,
            });

            const data = await res.json();

            if (!res.ok)
                throw new Error(data.error ?? "Erreur lors du preview");
            setPreview(data as PreviewData);
        } catch (e: any) {
            setError(e.message ?? "Erreur inconnue");
        } finally {
            setLoading(false);
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
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    // ── Import final ────────

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);
        try {
            const fd = new FormData();
            fd.append("fichier", file);
            fd.append("_token", getCsrf());

            const res = await fetch(route("participants.import"), {
                method: "POST",
                body: fd,
            });

            if (res.ok || res.redirected) {
                window.location.href = res.url || window.location.href;
            } else {
                setError("Erreur lors de l'import (" + res.status + ")");
                setImporting(false);
            }
        } catch (e: any) {
            setError(e.message ?? "Erreur inconnue");
            setImporting(false);
        }
    };

    // ── Modal inline cree

    const handleCreated = (option: SelectOption) => {
        if (modalType === "ecole") {
            setResolvedEcoles((r) => ({
                ...r,
                [modalContext]: option.id as number,
            }));
        } else if (modalType === "formation") {
            setResolvedFormations((r) => ({
                ...r,
                [modalContext]: option.id as number,
            }));
        } else if (modalType === "entreprise") {
            setResolvedEntreprises((r) => ({
                ...r,
                [modalContext]: option.id as number,
            }));
        }
        setModalType(null);
    };

    // ── Calcul des entites non resolues ───────────────────────────────────────

    const unresolvedEcoles = (preview?.unknownEcoles ?? []).filter(
        (n) => !resolvedEcoles[n],
    );
    const unresolvedFormations = (preview?.unknownFormations ?? []).filter(
        (n) => !resolvedFormations[n],
    );
    const unresolvedEntreprises = (preview?.unknownEntreprises ?? []).filter(
        (n) => !resolvedEntreprises[n],
    );
    const hasUnresolved =
        unresolvedEcoles.length +
            unresolvedFormations.length +
            unresolvedEntreprises.length >
        0;

    // ── Rendu ───────────────

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-800 mb-1">
                        Importation CSV / Excel
                    </h2>
                    <p className="text-sm text-gray-500">
                        Importez plusieurs participants. Colonnes acceptees :
                        <code className="mx-1 px-1 bg-gray-100 rounded text-xs">
                            nom, prenom, mail, telephone, role, ecole,
                            formation, entreprise, date_entree, date_sortiee
                        </code>
                    </p>
                </div>
                <a
                    href={route("participants.exemple")}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                    CSV exemple
                </a>
            </div>

            {/* Zone de depôt */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragging
                        ? "border-orange-400 bg-orange-50"
                        : file
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50"
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleInputChange}
                />

                {loading ? (
                    <>
                        <Loader2 className="w-10 h-10 text-orange-400 animate-spin mb-3" />
                        <p className="text-sm font-medium text-gray-600">
                            Analyse en cours…
                        </p>
                    </>
                ) : file ? (
                    <>
                        <FileSpreadsheet className="w-10 h-10 text-green-500 mb-3" />
                        <p className="text-sm font-semibold text-gray-800">
                            {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024).toFixed(1)} Ko — cliquer pour
                            changer
                        </p>
                    </>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-sm font-semibold text-gray-700">
                            Glisser-deposer ou cliquer pour parcourir
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Formats : .CSV, .XLSX (Max 10 Mo)
                        </p>
                    </>
                )}
            </div>

            {/* Erreur */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Succès import */}
            {importOk && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Import realise avec succès !
                </div>
            )}

            {/* Entites inconnues */}
            {preview &&
                (preview.unknownEcoles.length > 0 ||
                    preview.unknownFormations.length > 0 ||
                    preview.unknownEntreprises.length > 0) && (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Entités inconnues détectées — créez-les avant
                            d&apos;importer
                        </p>

                        {/* ecoles */}
                        {preview.unknownEcoles.length > 0 && (
                            <div className="bg-white border border-amber-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                    <Landmark className="w-3.5 h-3.5 text-elan-orange" />{" "}
                                    ecoles
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {preview.unknownEcoles.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setModalType("ecole");
                                                setModalDefault(name);
                                                setModalContext(name);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                resolvedEcoles[name]
                                                    ? "bg-green-50 border-green-300 text-green-700 cursor-default"
                                                    : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                            }`}
                                        >
                                            {resolvedEcoles[name] ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <PlusCircle className="w-3 h-3" />
                                            )}
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Formations */}
                        {preview.unknownFormations.length > 0 && (
                            <div className="bg-white border border-amber-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 text-elan-orange" />{" "}
                                    Formations
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {preview.unknownFormations.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setModalType("formation");
                                                setModalDefault(name);
                                                setModalContext(name);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                resolvedFormations[name]
                                                    ? "bg-green-50 border-green-300 text-green-700 cursor-default"
                                                    : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                            }`}
                                        >
                                            {resolvedFormations[name] ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <PlusCircle className="w-3 h-3" />
                                            )}
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Entreprises */}
                        {preview.unknownEntreprises.length > 0 && (
                            <div className="bg-white border border-amber-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-elan-orange" />{" "}
                                    Entreprises
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {preview.unknownEntreprises.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setModalType("entreprise");
                                                setModalDefault(name);
                                                setModalContext(name);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                resolvedEntreprises[name]
                                                    ? "bg-green-50 border-green-300 text-green-700 cursor-default"
                                                    : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                            }`}
                                        >
                                            {resolvedEntreprises[name] ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <PlusCircle className="w-3 h-3" />
                                            )}
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            {/* Tableau de previsualisation */}
            {preview && preview.rows.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                            Aperçu — {preview.rows.length} participant(s)
                        </p>
                        {hasUnresolved && (
                            <span className="text-xs text-amber-600 font-medium">
                                Creez d'abord les entites manquantes ci-dessus
                            </span>
                        )}
                    </div>
                    <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                <tr>
                                    {[
                                        "Nom",
                                        "Prenom",
                                        "Mail",
                                        "Rôle",
                                        "ecole",
                                        "Formation",
                                        "Entreprise",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {preview.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50/80">
                                        <td className="px-4 py-2.5">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {row.nom}
                                            </p>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <p className="text-xs text-gray-400">
                                                {row.prenom}
                                            </p>
                                        </td>
                                        <td className="px-4 py-2.5 text-xs text-gray-400">
                                            {row.mail}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadge[row.role] ?? "bg-gray-100 text-gray-600"}`}
                                            >
                                                {row.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <EntityCell
                                                value={row.ecole}
                                                isUnknown={
                                                    !!row.ecole &&
                                                    preview.unknownEcoles.includes(
                                                        row.ecole,
                                                    )
                                                }
                                                isResolved={
                                                    !!row.ecole &&
                                                    !!resolvedEcoles[row.ecole]
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <EntityCell
                                                value={row.formation}
                                                isUnknown={
                                                    !!row.formation &&
                                                    preview.unknownFormations.includes(
                                                        row.formation,
                                                    )
                                                }
                                                isResolved={
                                                    !!row.formation &&
                                                    !!resolvedFormations[
                                                        row.formation
                                                    ]
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <EntityCell
                                                value={row.entreprise}
                                                isUnknown={
                                                    !!row.entreprise &&
                                                    preview.unknownEntreprises.includes(
                                                        row.entreprise,
                                                    )
                                                }
                                                isResolved={
                                                    !!row.entreprise &&
                                                    !!resolvedEntreprises[
                                                        row.entreprise
                                                    ]
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bouton d'import */}
            {preview && preview.rows.length > 0 && (
                <button
                    onClick={handleImport}
                    disabled={importing || hasUnresolved}
                    className="w-full py-3 bg-elan-orange hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {importing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Import
                            en cours…
                        </>
                    ) : hasUnresolved ? (
                        <>
                            <AlertCircle className="w-4 h-4" /> Creez d'abord
                            les entites manquantes
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" /> Importer{" "}
                            {preview.rows.length} participant(s)
                        </>
                    )}
                </button>
            )}

            {/* Modal inline */}
            <InlineCreateModal
                type={modalType}
                defaultName={modalDefault}
                onClose={() => setModalType(null)}
                onCreated={handleCreated}
            />
        </div>
    );
}
