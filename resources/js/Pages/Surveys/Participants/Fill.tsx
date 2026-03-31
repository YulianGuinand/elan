import { Survey } from "@/types/surveys";

interface Props {
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    enquete: Survey;
}

export default function Fill(data: Props) {
    return (
        <>
            <div>{data.nom}</div>
            <div>{data.prenom}</div>
            <div>{data.telephone}</div>
            <div>{data.mail}</div>
            <div>{data.enquete.titre}</div>
            <div>{data.enquete.description}</div>
            <div>{data.enquete.date_debut}</div>
            <div>{data.enquete.date_fin}</div>
            <div>{data.enquete.type_campagne}</div>
          
        </>
    );
}
