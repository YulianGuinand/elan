import FadeIn from "@/Components/Animations/FadeIn";
import { router } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Info,
    Search,
} from "lucide-react";
import { Survey } from "../../../../types/surveys";
import { Participant } from "../../Fill";

interface Props {
    participants: any;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    roleFilter: string;
    onRoleChange: (role: string) => void;
    onSelect: (participant: Participant) => void;
    availableRoles: string[];
    enquete: Survey;
}

export default function ParticipantSelection({
    participants,
    searchQuery,
    onSearchChange,
    roleFilter,
    onRoleChange,
    onSelect,
    availableRoles,
    enquete,
}: Props) {
    const roles = ["Tous", ...availableRoles];
    const paginatedParticipants = participants.data;

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-orange-100 text-orange-600",
            "bg-blue-100 text-blue-600",
            "bg-green-100 text-green-600",
            "bg-purple-100 text-purple-600",
            "bg-slate-100 text-slate-600",
        ];
        return colors[id % colors.length];
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("surveys.fill", { id: enquete.id }),
            { search: searchQuery, role: roleFilter, page: page },
            { preserveState: true, replace: true, only: ["participants"] },
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Colonne Gauche: Détails et Aide */}
                <div className="lg:col-span-4 space-y-8">
                    <FadeIn delay={100}>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-orange-500" />
                                <h3 className="font-black text-base text-gray-900 tracking-tight">
                                    Détails de l&apos;enquête
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-1">
                                        Titre
                                    </span>
                                    <p className="text-gray-900 font-black text-base leading-snug">
                                        {enquete.titre}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-1">
                                        Description
                                    </span>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        {enquete.description ||
                                            "Enquête annuelle sur le devenir des apprenants."}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-2">
                                        Cible
                                    </span>
                                    <span className="inline-flex px-5 py-2 bg-orange-50/50 text-orange-600 rounded-lg text-xs font-black uppercase tracking-wider border border-orange-100/50">
                                        {enquete.type_campagne || "Apprentis"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <div className="bg-[#F58232] rounded-2xl p-6 text-white relative overflow-hidden group">
                            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <HelpCircle className="w-5 h-5" />
                                    <h3 className="font-black text-base tracking-tight">
                                        Besoin d&apos;aide ?
                                    </h3>
                                </div>
                                <p className="text-white/90 text-sm font-bold mb-4 leading-relaxed">
                                    Si le participant n&apos;est pas dans la
                                    liste, assurez-vous qu&apos;il a bien été
                                    importé dans la base de données globale des
                                    contacts.
                                </p>
                                <button
                                    onClick={() =>
                                        router.get(route("participants.index"))
                                    }
                                    className="w-full py-2 bg-white text-[#F58232] font-black rounded-lg uppercase tracking-[0.15em] text-xs"
                                >
                                    Consulter l&apos;aide
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Colonne Droite: Filtres et Liste */}
                <div className="lg:col-span-8">
                    <FadeIn delay={150}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Header Filtres */}
                            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-2 items-center justify-between">
                                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto border border-gray-200">
                                    {roles.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => onRoleChange(role)}
                                            className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                                roleFilter === role
                                                    ? "bg-white text-gray-900 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-600"
                                            }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full md:w-80">
                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            onSearchChange(e.target.value)
                                        }
                                        placeholder="Rechercher..."
                                        className="w-full pl-8 pr-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-4 focus:ring-transparent focus:border-orange-500/50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-b border-gray-50">
                                            <th className="px-5 py-4 text-left font-black">
                                                Participant
                                            </th>
                                            <th className="px-5 py-4 text-center font-black">
                                                Rôle
                                            </th>
                                            <th className="px-10 py-4 text-right font-black">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {paginatedParticipants.length > 0 ? (
                                            paginatedParticipants.map(
                                                (participant: Participant) => (
                                                    <tr
                                                        key={participant.id}
                                                        className="group hover:bg-gray-100/80 transition-all duration-300"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-5">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${getAvatarColor(participant.id)}`}
                                                                >
                                                                    {getInitials(
                                                                        participant.prenom,
                                                                        participant.nom,
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-base font-black text-gray-900">
                                                                        {
                                                                            participant.prenom
                                                                        }{" "}
                                                                        {
                                                                            participant.nom
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-400 font-bold">
                                                                        {
                                                                            participant.mail
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-center">
                                                            <span className="inline-flex px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                                                {participant.role ||
                                                                    "Alumni"}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <button
                                                                onClick={() =>
                                                                    onSelect(
                                                                        participant,
                                                                    )
                                                                }
                                                                className="px-6 py-2 bg-[#F58232] text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-all"
                                                            >
                                                                Sélectionner
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="px-0 py-6 text-center"
                                                >
                                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-300">
                                                        <Search className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
                                                        Aucun participant trouvé
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Pagination */}
                            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/20">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    Affichage de{" "}
                                    {(participants.current_page - 1) *
                                        participants.per_page +
                                        1}
                                    -
                                    {Math.min(
                                        participants.current_page *
                                            participants.per_page,
                                        participants.total,
                                    )}{" "}
                                    sur {participants.total} participants
                                </p>
                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={
                                            participants.current_page === 1
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                participants.current_page - 1,
                                            )
                                        }
                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        disabled={
                                            participants.current_page >=
                                            participants.last_page
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                participants.current_page + 1,
                                            )
                                        }
                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
