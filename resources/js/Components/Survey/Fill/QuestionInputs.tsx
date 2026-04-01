import { Choix } from "@/types/surveys";
import { Check } from "lucide-react";

export const TextInput = ({
    value,
    onChange,
    placeholder = "Votre réponse...",
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) => (
    <div className="relative group">
        <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md focus:ring-elan-orange focus:border-0 focus:border-elan-orange"
        />
    </div>
);

export const TextAreaInput = ({
    value,
    onChange,
    placeholder = "Expliquez plus en détail...",
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) => (
    <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md focus:ring-elan-orange focus:border-0 focus:border-elan-orange"
    />
);

export const NumberInput = ({
    value,
    onChange,
    placeholder = "0",
}: {
    value: any;
    onChange: (v: number | "") => void;
    placeholder?: string;
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const sanitized = inputValue.replace(/[^\d.\-]/g, "");
        const withoutMinus = sanitized.replace(/-/g, "");
        const final = sanitized.startsWith("-")
            ? "-" + withoutMinus
            : withoutMinus;
        const parts = final.split(".");
        const validFinal =
            parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : final;

        onChange(
            validFinal === "" || validFinal === "-" ? "" : Number(validFinal),
        );
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full text-2xl font-bold py-4 px-6 rounded-md border-2 border-gray-100 focus:border-elan-orange focus:ring-0 transition-all"
        />
    );
};

export const DateInput = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => (
    <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xl py-4 px-6 rounded-md border-2 border-gray-100 focus:border-elan-orange focus:ring-0 font-medium text-gray-700"
    />
);

export const RadioInput = ({
    options,
    value,
    onChange,
}: {
    options: Choix[];
    value: any;
    onChange: (v: any) => void;
}) => (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-4">
        {options?.map((opt) => {
            const isSelected = value === opt.id || value === opt.libelle;
            return (
                <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange(opt.id)}
                    className={`flex items-center p-5 sm:p-6 rounded-md border-2 text-left transition-all duration-300 active:scale-[0.98] group ${
                        isSelected
                            ? "border-elan-orange bg-elan-orange/5"
                            : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
                    }`}
                >
                    <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                            isSelected
                                ? "border-elan-orange bg-elan-orange shadow-inner"
                                : "border-gray-200 group-hover:border-elan-orange/30"
                        }`}
                    >
                        {isSelected && (
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white" />
                        )}
                    </div>
                    <span
                        className={`text-lg sm:text-xl font-bold transition-colors ${
                            isSelected ? "text-elan-orange" : "text-gray-600"
                        }`}
                    >
                        {opt.libelle}
                    </span>
                </button>
            );
        })}
    </div>
);

export const CheckboxInput = ({
    options,
    value = [],
    onChange,
}: {
    options: Choix[];
    value: any[];
    onChange: (v: any[]) => void;
}) => {
    const toggleValue = (val: any) => {
        const newValue = [...(value || [])];
        const index = newValue.indexOf(val);
        if (index > -1) {
            newValue.splice(index, 1);
        } else {
            newValue.push(val);
        }
        onChange(newValue);
    };

    return (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-4">
            {options?.map((opt) => {
                const isSelected = (value || []).includes(opt.id);
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleValue(opt.id)}
                        className={`flex items-center p-5 sm:p-6 rounded-md border-2 text-left transition-all duration-300 active:scale-[0.98] group ${
                            isSelected
                                ? "border-elan-orange bg-elan-orange/5"
                                : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50 shadow-sm"
                        }`}
                    >
                        <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                                isSelected
                                    ? "border-elan-orange bg-elan-orange"
                                    : "border-gray-200 group-hover:border-elan-orange/30"
                            }`}
                        >
                            {isSelected && (
                                <Check className="text-white size-4" />
                            )}
                        </div>
                        <span
                            className={`text-lg sm:text-xl font-bold transition-colors ${
                                isSelected
                                    ? "text-elan-orange"
                                    : "text-gray-600"
                            }`}
                        >
                            {opt.libelle}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export const LikertInput = ({
    options,
    value,
    onChange,
    likertStyle = "emoji",
}: {
    options?: Choix[];
    value: any;
    onChange: (v: any) => void;
    likertStyle?: "emoji" | "custom";
}) => {
    const displayOptions =
        options && options.length > 0
            ? options
            : [
                  { id: 1, libelle: "Pas du tout d'accord", emoji: "😠" },
                  { id: 2, libelle: "Plutôt pas d'accord", emoji: "😕" },
                  { id: 3, libelle: "Neutre", emoji: "😐" },
                  { id: 4, libelle: "Plutôt d'accord", emoji: "🙂" },
                  { id: 5, libelle: "Tout à fait d'accord", emoji: "😍" },
              ];

    const isEmojiStyle = likertStyle === "emoji";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 pt-4">
            {displayOptions.map((opt, index) => {
                const optVal = index + 1;
                const isSelected = value === optVal;

                return (
                    <button
                        key={opt.id || index}
                        type="button"
                        onClick={() => onChange(optVal)}
                        className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all duration-300 group ${
                            isSelected
                                ? "border-elan-orange bg-elan-orange/5 ring-0"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                    >
                        {isEmojiStyle ? (
                            <div className="text-4xl mb-2">
                                {opt.emoji || "😐"}
                            </div>
                        ) : (
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-2 transition-all ${
                                    isSelected
                                        ? "bg-elan-orange text-white rotate-[360deg]"
                                        : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-500"
                                }`}
                            >
                                {optVal}
                            </div>
                        )}
                        <span
                            className={`text-[10px] sm:text-xs font-bold text-center leading-tight transition-colors uppercase tracking-tight ${
                                isSelected
                                    ? "text-elan-orange"
                                    : "text-gray-400"
                            }`}
                        >
                            {opt.libelle}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export const SelectInput = ({
    options,
    value,
    onChange,
}: {
    options: Choix[];
    value: any;
    onChange: (v: any) => void;
}) => (
    <div className="relative">
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-xl py-4 px-6 rounded-md border-2 border-gray-100 focus:border-elan-orange focus:ring-0 transition-all appearance-none bg-white font-medium text-gray-700 shadow-sm"
        >
            <option value="" disabled>
                Sélectionnez une option
            </option>
            {options?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                    {opt.libelle}
                </option>
            ))}
        </select>
    </div>
);
