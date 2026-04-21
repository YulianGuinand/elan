import SecondaryButton from "@/Components/SecondaryButton";
import {Participant} from "@/Pages/Surveys/Fill";

interface ParticipantCardProps {
    participant: Participant;
    answeredAt?: string;
    onChangeParticipant: () => void;
}

const getInitials = (p: Participant) =>
    `${p.prenom?.[0] ?? ""}${p.nom?.[0] ?? ""}`.toUpperCase();

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function ParticipantCard({
    participant,
    answeredAt,
    onChangeParticipant,
}: ParticipantCardProps) {

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-sm font-black text-orange-700 flex-shrink-0">
                    {getInitials(participant)}
                </div>
                <div>
                    <p className="font-black text-gray-900 text-sm">
                        {participant.prenom}{" "}
                        {participant.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                        {participant.role}
                    </p>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-1">
                {participant
                    .entreprises?.[0] && (
                    <p>
                        {
                            participant
                                .entreprises[0].nom
                        }
                    </p>
                )}
                {answeredAt && (
                    <p>
                        Répondu le{" "}
                        <span className="text-gray-700">
                                                    {formatDate(answeredAt)}
                                                </span>
                    </p>
                )}
            </div>

            <SecondaryButton
                type="button"
                onClick={onChangeParticipant}
                className="w-full mt-4 justify-center text-xs"
            >
                Changer de participant
            </SecondaryButton>
        </div>
    );
}
