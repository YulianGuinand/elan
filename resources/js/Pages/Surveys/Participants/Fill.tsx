import { Survey } from "@/types/surveys";

interface Props {
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    enquete: Survey;
}

export default function Fill(data: Props) {
    return <div>{data.prenom}</div>;
}
