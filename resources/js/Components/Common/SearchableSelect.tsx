import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

export interface SelectOption {
    id: number | string;
    name: string;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: SelectOption | null;
    onChange: (value: SelectOption | null) => void;
    placeholder?: string;
    allowCreate?: boolean;
    createLabel?: string;
    disabled?: boolean;
    /** Si fourni, appelé à la place de onChange quand l'utilisateur clique "Créer" */
    onCreateRequest?: (query: string) => void;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Sélectionner...",
    allowCreate = false,
    createLabel = "Créer",
    disabled = false,
    onCreateRequest,
}: SearchableSelectProps) {
    const [query, setQuery] = useState("");

    const filteredOptions =
        query === ""
            ? options
            : options.filter((option) =>
                  option.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, "")),
              );

    const isExactMatch = options.some(
        (option) => option.name.toLowerCase() === query.toLowerCase(),
    );

    const showCreateOption = allowCreate && query !== "" && !isExactMatch;

    return (
        <div className="relative w-full">
            <Combobox value={value} onChange={onChange} disabled={disabled}>
                <div className="relative">
                    <ComboboxInput
                        className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none pr-10 ${
                            disabled
                                ? "opacity-50 cursor-not-allowed bg-gray-50"
                                : ""
                        }`}
                        displayValue={(option: SelectOption | null) =>
                            option?.name ?? ""
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronsUpDown
                            className="w-5 h-5 text-gray-400 hover:text-gray-500"
                            aria-hidden="true"
                        />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    transition
                    className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                >
                    {filteredOptions.length === 0 && !showCreateOption ? (
                        <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                            Aucun résultat trouvé.
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.id}
                                className={({ focus }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        focus
                                            ? "bg-orange-100 text-orange-900"
                                            : "text-gray-900"
                                    }`
                                }
                                value={option}
                            >
                                {({ selected, focus }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                                        >
                                            {option.name}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                    focus
                                                        ? "text-orange-600"
                                                        : "text-orange-600"
                                                }`}
                                            >
                                                <Check
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ComboboxOption>
                        ))
                    )}

                    {showCreateOption && (
                        <div
                            onClick={() => {
                                if (onCreateRequest) {
                                    onCreateRequest(query);
                                    setQuery("");
                                }
                            }}
                            className="relative cursor-pointer select-none py-2 pl-4 pr-4 border-t border-gray-100 text-orange-700 hover:bg-orange-50 hover:text-orange-900 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span className="block truncate font-medium">
                                    {createLabel} "{query}"
                                </span>
                            </div>
                        </div>
                    )}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}
