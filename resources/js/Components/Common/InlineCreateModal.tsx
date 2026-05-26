import Modal from "@/Components/Common/Modal";
import { SelectOption } from "@/Components/Common/SearchableSelect";
import { Building2, ChevronDown, GraduationCap, Landmark } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// ─── Types ──────────────────────────────────────────────────────────────────

type EntityType = "ecole" | "formation" | "entreprise";

interface InlineModalProps {
    type: EntityType | null;
    defaultName?: string;
    onClose: () => void;
    onCreated: (option: SelectOption) => void;
    knownEntreprises?: { id: number; raison_sociale: string }[];
    knownEcoles?: { id: number; libelle: string }[];
    knownFormations?: { id: number; libelle: string }[];
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
    knownEcoles,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
    knownEcoles?: { id: number; libelle: string }[];
}) {
    const [form, setForm] = useState({
        libelle: defaultName,
        adresse: "",
        code_postal: "",
        ville: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(true);

    const knownEcoleItems =
        knownEcoles?.map((ecole) => ({
            id: ecole.id,
            name: ecole.libelle,
        })) ?? [];

    const set =
        (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isCreating) {
            return;
        }

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
            <div className="flex items-center w-full">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(false);
                    }}
                    variant={isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Selectionner une école
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(true);
                    }}
                    variant={!isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Créer une école
                </Button>
            </div>
            {isCreating ? (
                <>
                    <div>
                        <label
                            htmlFor="libelle"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nom de l'école *
                        </label>
                        <input
                            id="libelle"
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
                </>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Choisissez une école existante. La sélection fermera le
                        modal immédiatement.
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full",
                            })}
                        >
                            Selectionner une école existante
                            <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {knownEcoleItems.length > 0 ? (
                                knownEcoleItems.map((e) => (
                                    <DropdownMenuItem
                                        key={e.id}
                                        onClick={() => {
                                            onCreated({
                                                id: e.id,
                                                name: e.name,
                                            });
                                            onClose();
                                        }}
                                    >
                                        {e.name}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    Aucune école existante disponible.
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            Créer l'école
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}

// ─── Formulaire Formation ─────────────────────────────────────────────────────

function FormationForm({
    defaultName,
    onCreated,
    onClose,
    knownFormations,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
    knownFormations?: { id: number; libelle: string }[];
}) {
    const [libelle, setLibelle] = useState(defaultName);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(true);

    const knownFormationItems =
        knownFormations?.map((formation) => ({
            id: formation.id,
            name: formation.libelle,
        })) ?? [];

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isCreating) {
            return;
        }

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
            <div className="flex items-center w-full">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(false);
                    }}
                    variant={isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Sélectionner une formation
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(true);
                    }}
                    variant={!isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Créer une formation
                </Button>
            </div>
            {isCreating ? (
                <>
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
                </>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Choisissez une formation existante. La sélection ferme
                        le modal immédiatement.
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full",
                            })}
                        >
                            Sélectionner une formation existante
                            <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {knownFormationItems.length > 0 ? (
                                knownFormationItems.map((formation) => (
                                    <DropdownMenuItem
                                        key={formation.id}
                                        onClick={() => {
                                            onCreated({
                                                id: formation.id,
                                                name: formation.name,
                                            });
                                            onClose();
                                        }}
                                    >
                                        {formation.name}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    Aucune formation existante disponible.
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            Créer la formation
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}

// ─── Formulaire Entreprise ────────────────────────────────────────────────────

function EntrepriseForm({
    defaultName,
    onCreated,
    onClose,
    knownEntreprises,
}: {
    defaultName: string;
    onCreated: (o: SelectOption) => void;
    onClose: () => void;
    knownEntreprises?: { id: number; raison_sociale: string }[];
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
    const [isCreating, setIsCreating] = useState(true);

    const knownEntrepriseItems =
        knownEntreprises?.map((entreprise) => ({
            id: entreprise.id,
            name: entreprise.raison_sociale,
        })) ?? [];

    const set =
        (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isCreating) {
            return;
        }

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
            <div className="flex items-center w-full">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(false);
                    }}
                    variant={isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Sélectionner une entreprise
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(true);
                    }}
                    variant={!isCreating ? "ghost" : "default"}
                    className="w-1/2"
                >
                    Créer une entreprise
                </Button>
            </div>
            {isCreating ? (
                <>
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
                </>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Choisissez une entreprise existante. La sélection ferme
                        le modal immédiatement.
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full",
                            })}
                        >
                            Sélectionner une entreprise existante
                            <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {knownEntrepriseItems.length > 0 ? (
                                knownEntrepriseItems.map((entreprise) => (
                                    <DropdownMenuItem
                                        key={entreprise.id}
                                        onClick={() => {
                                            onCreated({
                                                id: entreprise.id,
                                                name: entreprise.name,
                                            });
                                            onClose();
                                        }}
                                    >
                                        {entreprise.name}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    Aucune entreprise existante disponible.
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex-1 px-4 py-2 bg-elan-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            Créer l'entreprise
                        </button>
                    </div>
                </div>
            )}
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
    knownEcoles,
    knownEntreprises,
    knownFormations,
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
                    knownEcoles={knownEcoles}
                />
            )}
            {type === "formation" && (
                <FormationForm
                    defaultName={defaultName}
                    onCreated={onCreated}
                    onClose={onClose}
                    knownFormations={knownFormations}
                />
            )}
            {type === "entreprise" && (
                <EntrepriseForm
                    defaultName={defaultName}
                    onCreated={onCreated}
                    onClose={onClose}
                    knownEntreprises={knownEntreprises}
                />
            )}
        </Modal>
    );
}

export type { EntityType };
