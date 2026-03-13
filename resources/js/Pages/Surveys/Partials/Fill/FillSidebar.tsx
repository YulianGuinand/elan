import { Participant } from "../../Fill";
import {Mail, MapPin, Phone, UserIcon} from "lucide-react";

interface Props {
    participant: Participant | null;
    onChangeParticipant: () => void;
}

export default function FillSidebar({
    participant,
    onChangeParticipant,
}: Props) {
    if (!participant) return null;

    return <aside className="w-full space-y-6">
        <div className="bg-white rounded-xl border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-24 bg-[#F58232] relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                                <span className="text-xl font-black text-gray-400">
                                    {(participant?.prenom?.[0] || "") +
                                        (participant?.nom?.[0] || "")
                                    }
                                </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12 pb-6 px-6 text-center">
                <div className="mb-4">
                    <h2 className="text-lg font-black text-gray-900 leading-tight">
                        {participant?.prenom} {participant?.nom}
                    </h2>
                    <span className="in-lineblock mt-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-black text-[9px] uppercase tracking-wider border border-orange-100/30">
                            {participant?.role || "Participant"}
                        </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-6">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
                        <MapPin className="w-3.5 h-3.5 text-gray-300"/>
                    </div>
                    <span className="text-[11px] font-bold">
                            {participant?.entreprises?.[0]?.nom || "Sans Entreprise"}
                        </span>
                </div>

                <div className="space-y-2 pb-2">
                    <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/50 flex items-center gap-3 text-left hover:bg-white hover:border-orange-200 transition-all group">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-orange-500 shadow-sm">
                            <Phone className="w-4 h-4"/>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                Mobile
                            </p>
                            <p className="text-xs font-black text-gray-700 truncate">
                                {participant?.telephone || "Non renseigné"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/50 flex items-center gap-3 text-left hover:bg-white hover:border-orange-200 transition-all group">
                        <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-orange-500 shadow-sm">
                            <Mail className="w-4 h-4"/>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                Mail
                            </p>
                            <p className="text-xs font-black text-gray-700 truncate">
                                {participant?.mail || "Non renseigné"}
                            </p>
                        </div>
                    </div>
                </div>
                <button onClick={onChangeParticipant}
                        className="mt-4 text-[9px] font-black text-gray-300 hover:text-orange-500 hover:bg-orange-50 uppercase tracking-widest flex items-center gap-1.5 mx-auto transition-colors group px-4 py-2 rounded-lg"
                >
                    <UserIcon className="w-3 h-3"/>
                    Changer de participant
                </button>
            </div>
        </div>
    </aside>;
}
