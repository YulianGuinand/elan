import Badge from "@/Components/Common/Badge";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Participant } from "@/types/participant";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";

interface ManualEntryFormProps {
    onSubmit: (participant: Participant) => void;
    isSubmitting?: boolean;
}

const initialFormState: Participant = {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    role: "apprenant",
    programme_formation: "",
};

export default function ManualEntryForm({
    onSubmit,
    isSubmitting = false,
}: ManualEntryFormProps) {
    const [formData, setFormData] = useState<Participant>(initialFormState);
    const [errors, setErrors] = useState<
        Partial<Record<keyof Participant, string>>
    >({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Participant, string>> = {};

        if (!formData.prenom || formData.prenom.length < 2) {
            newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
        }

        if (!formData.nom || formData.nom.length < 2) {
            newErrors.nom = "Le nom doit contenir au moins 2 caractères";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (
            formData.telephone &&
            !/^[0-9\s+()-]{10,}$/.test(formData.telephone)
        ) {
            newErrors.telephone = "Numéro de téléphone invalide";
        }

        if (!formData.role) {
            newErrors.role = "Le rôle est requis";
        }

        if (formData.role === "apprenant" && !formData.programme_formation) {
            newErrors.programme_formation =
                "Le programme de formation est requis pour les apprenants";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            onSubmit(formData);
            setFormData(initialFormState);
            setErrors({});
        }
    };

    const updateField = (field: keyof Participant, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Badge */}
            <Badge
                variant="primary"
                className="text-xs font-semibold uppercase"
            >
                Action Individuelle
            </Badge>

            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom *" />
                    <TextInput
                        id="prenom"
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => updateField("prenom", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Jean"
                    />
                    {errors.prenom && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.prenom}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="nom" value="Nom *" />
                    <TextInput
                        id="nom"
                        type="text"
                        value={formData.nom}
                        onChange={(e) => updateField("nom", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Dupont"
                    />
                    {errors.nom && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.nom}
                        </p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div>
                <InputLabel htmlFor="email" value="Adresse email *" />
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="block w-full pl-8"
                        placeholder="jean.dupont@exemple.fr"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {/* Téléphone & Rôle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="telephone" value="Téléphone" />
                    <TextInput
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) =>
                            updateField("telephone", e.target.value)
                        }
                        className="mt-1 block w-full"
                        placeholder="06 12 34 56 78"
                    />
                    {errors.telephone && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.telephone}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="role" value="Rôle du participant *" />
                    <select
                        id="role"
                        value={formData.role}
                        onChange={(e) =>
                            updateField(
                                "role",
                                e.target.value as Participant["role"]
                            )
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-elan-orange focus:ring-elan-orange"
                    >
                        <option value="apprenant">Apprenant</option>
                        <option value="tuteur">Tuteur</option>
                        <option value="formateur">Formateur</option>
                        <option value="employeur">Employeur</option>
                    </select>
                    {errors.role && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.role}
                        </p>
                    )}
                </div>
            </div>

            {/* Programme de formation (conditonnel) */}
            {formData.role === "apprenant" && (
                <div>
                    <InputLabel
                        htmlFor="programme"
                        value="Programme de formation *"
                    />
                    <select
                        id="programme"
                        value={formData.programme_formation}
                        onChange={(e) =>
                            updateField("programme_formation", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-elan-orange focus:ring-elan-orange"
                    >
                        <option value="">Sélectionner un programme</option>
                        <option value="BTS Management Commercial Opérationnel">
                            BTS Management Commercial Opérationnel
                        </option>
                        <option value="BTS Négociation et Digitalisation">
                            BTS Négociation et Digitalisation
                        </option>
                        <option value="BTS Comptabilité et Gestion">
                            BTS Comptabilité et Gestion
                        </option>
                        <option value="BTS Assistant de Gestion PME-PMI">
                            BTS Assistant de Gestion PME-PMI
                        </option>
                    </select>
                    {errors.programme_formation && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.programme_formation}
                        </p>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center"
            >
                <UserPlus className="w-4 h-4 mr-2" />
                {isSubmitting
                    ? "Enregistrement..."
                    : "Enregistrer le participant"}
            </PrimaryButton>
        </form>
    );
}
