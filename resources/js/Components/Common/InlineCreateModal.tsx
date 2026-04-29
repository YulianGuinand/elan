import Modal from "@/Components/Common/Modal";
import { SelectOption } from "@/Components/Common/SearchableSelect";
import { Building2, GraduationCap, Landmark } from "lucide-react";
import { FormEvent, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type EntityType = "ecole" | "formation" | "entreprise";

interface InlineModalProps {
    type: EntityType | null;
    defaultName?: string;
    onClose: () => void;
    onCreated: (option: SelectOption) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCsrfToken(): string {
    return (
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
            ?.content ?? ""
    );
}

function inputClass(hasError?: boolean) {
    return `w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all bg-white
        ${
            hasError
                ? "border-red-400 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        }`;
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

// ─── Formulaire École ─────────────────────────────────────────────────────────

function EcoleForm({
    defaultName,
    onCreated,
    onClose,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        libelle: defaultName,
        adresse: "",
        code_postal: "",
        ville: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const set =
        (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch(route("inline.ecole"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors(data.errors ?? {});
                return;
            }
            onCreated({ id: data.id, name: data.name });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'école *
                </label>
                <input
                    className={inputClass(!!errors.libelle)}
                    value={form.libelle}
                    onChange={set("libelle")}
                    placeholder="ex: ENSIIE"
                />
                <FieldError message={errors.libelle} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                </label>
                <input
                    className={inputClass(!!errors.adresse)}
                    value={form.adresse}
                    onChange={set("adresse")}
                    placeholder="ex: 1 square de la résistance"
                />
                <FieldError message={errors.adresse} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postale *
                    </label>
                    <input
                        className={inputClass(!!errors.code_postal)}
                        value={form.code_postal}
                        onChange={set("code_postal")}
                        placeholder="91000"
                        maxLength={5}
                    />
                    <FieldError message={errors.code_postal} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                    </label>
                    <input
                        className={inputClass(!!errors.ville)}
                        value={form.ville}
                        onChange={set("ville")}
                        placeholder="Évry"
                    />
                    <FieldError message={errors.ville} />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                    {loading ? "Création…" : "Créer l'école"}
                </button>
            </div>
        </form>
    );
}

// ─── Formulaire Formation ─────────────────────────────────────────────────────

function FormationForm({
    defaultName,
    onCreated,
    onClose,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
}) {
    const [libelle, setLibelle] = useState(defaultName);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch(route("inline.formation"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    Accept: "application/json",
                },
                body: JSON.stringify({ libelle }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors(data.errors ?? {});
                return;
            }
            onCreated({ id: data.id, name: data.name });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la formation *
                </label>
                <input
                    className={inputClass(!!errors.libelle)}
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    placeholder="ex: BTS SIO SLAM"
                />
                <FieldError message={errors.libelle} />
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                    {loading ? "Création…" : "Créer la formation"}
                </button>
            </div>
        </form>
    );
}

// ─── Formulaire Entreprise ────────────────────────────────────────────────────

function EntrepriseForm({
    defaultName,
    onCreated,
    onClose,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        raison_sociale: defaultName,
        mail: "",
        telephone: "",
        ville: "",
        nom: "",
        prenom: "",
        code_postal: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const set =
        (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch(route("inline.entreprise"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            console.log(data);

            if (!res.ok) {
                setErrors(data.errors ?? {});
                return;
            }
            onCreated({ id: data.id, name: data.name });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison sociale *
                </label>
                <input
                    className={inputClass(!!errors.raison_sociale)}
                    value={form.raison_sociale}
                    onChange={set("raison_sociale")}
                    placeholder="ex: Tech Solutions SAS"
                />
                <FieldError message={errors.raison_sociale} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                </label>
                <input
                    type="email"
                    className={inputClass(!!errors.mail)}
                    value={form.mail}
                    onChange={set("mail")}
                    placeholder="contact@entreprise.fr"
                />
                <FieldError message={errors.mail} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                    </label>
                    <input
                        className={inputClass()}
                        value={form.telephone}
                        onChange={set("telephone")}
                        placeholder="06 12 34 56 78"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville
                    </label>
                    <input
                        className={inputClass()}
                        value={form.ville}
                        onChange={set("ville")}
                        placeholder="Paris"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postale
                    </label>
                    <input
                        className={inputClass()}
                        value={form.code_postal}
                        onChange={set("code_postal")}
                        placeholder="39000"
                    />
                </div>
            </div>
            <div className="flex items-center justify-center gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de l&apos;interlocuteur
                    </label>
                    <input
                        className={inputClass()}
                        value={form.nom}
                        onChange={set("nom")}
                        placeholder="Dupont"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom de l&apos;interlocuteur
                    </label>
                    <input
                        className={inputClass()}
                        value={form.prenom}
                        onChange={set("prenom")}
                        placeholder="Marie"
                    />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                    {loading ? "Création…" : "Créer l'entreprise"}
                </button>
            </div>
        </form>
    );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const config: Record<EntityType, { title: string; icon: React.ReactNode }> = {
    ecole: {
        title: "Nouvelle école",
        icon: <Landmark className="w-5 h-5 text-elan-orange" />,
    },
    formation: {
        title: "Nouvelle formation",
        icon: <GraduationCap className="w-5 h-5 text-elan-orange" />,
    },
    entreprise: {
        title: "Nouvelle entreprise",
        icon: <Building2 className="w-5 h-5 text-elan-orange" />,
    },
};

export default function InlineCreateModal({
    type,
    defaultName = "",
    onClose,
    onCreated,
}: InlineModalProps) {
    const isOpen = type !== null;
    const conf = type ? config[type] : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={conf ? conf.title : ""}>
            {type === "ecole" && (
                <EcoleForm
                    defaultName={defaultName}
                    onCreated={onCreated}
                    onClose={onClose}
                />
            )}
            {type === "formation" && (
                <FormationForm
                    defaultName={defaultName}
                    onCreated={onCreated}
                    onClose={onClose}
                />
            )}
            {type === "entreprise" && (
                <EntrepriseForm
                    defaultName={defaultName}
                    onCreated={onCreated}
                    onClose={onClose}
                />
            )}
        </Modal>
    );
}

export type { EntityType };
