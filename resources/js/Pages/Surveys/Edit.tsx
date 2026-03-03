import FadeIn from "@/Components/Animations/FadeIn";
import Stepper from "@/Components/Common/Stepper";
import SurveyBasicInfo from "@/Components/SurveyBuilder/SurveyBasicInfo";
import SurveyBuilder from "@/Components/SurveyBuilder/SurveyBuilder";
import SurveyPreview from "@/Components/SurveyBuilder/SurveyPreview";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    SurveyBuilderProvider,
    useSurveyBuilder,
} from "@/contexts/SurveyBuilderContext";
import { Question, SurveyBuilderState, Theme } from "@/types/surveyBuilder";
import { Survey, TypeReponse } from "@/types/surveys";
import { Head } from "@inertiajs/react";
import { nanoid } from "nanoid";

interface Props {
    enquete: Survey;
    typesReponse: TypeReponse[];
}

function EditSurveyContent({ typesReponse, enquete }: Props) {
    const { state } = useSurveyBuilder();

    return (
        <>
            <Head title={`Modifier — ${enquete.titre}`} />

            <DashboardLayout
                title="Modifier l'enquête"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Modifier" },
                ]}
                noPadding={true}
            >
                <div className="space-y-6">
                    {/* Stepper */}
                    <FadeIn delay={50}>
                        <div className="bg-white shadow-sm p-4 sm:p-6">
                            <Stepper currentStep={state.currentStep} />
                        </div>
                    </FadeIn>

                    {/* Content based on step */}
                    {state.currentStep === "info" && <SurveyBasicInfo />}
                    {state.currentStep === "builder" && <SurveyBuilder />}
                    {state.currentStep === "preview" && (
                        <SurveyPreview typesReponse={typesReponse} />
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}

export default function SurveyEdit({ enquete, typesReponse }: Props) {
    // 1. Map Laravel "Enquete" to "SurveyBuilderState"
    // Since the database currently has a flat list of questions, we put them all in one default Theme.

    // Map choice objects back to QuestionOptions
    const formatQuestions = (): Question[] => {
        return enquete.questions.map((q, idx) => {
            // Map the type title back to the builder's string key
            let builderType = "text";
            switch (q.type_reponse) {
                case "Texte court":
                    builderType = "text";
                    break;
                case "Texte long":
                    builderType = "textarea";
                    break;
                case "Choix unique":
                    builderType = "radio";
                    break;
                case "Choix multiples":
                    builderType = "checkbox";
                    break;
                case "Liste déroulante":
                    builderType = "select";
                    break;
                case "Nombre":
                    builderType = "number";
                    break;
                case "Date":
                    builderType = "date";
                    break;
                case "Échelle linéaire":
                    builderType = "likert";
                    break;
            }

            return {
                id: nanoid(),
                type: builderType as any,
                label: q.libelle,
                required: false, // The DB does not store required yet, fallback to false
                order: q.numero || idx,
                options: q.choix
                    ? q.choix.map((c) => ({
                          id: nanoid(),
                          label: c.libelle,
                          value: c.libelle,
                      }))
                    : undefined,
            };
        });
    };

    const initialTheme: Theme = {
        id: nanoid(),
        title: "Questions de l'enquête",
        description: "",
        order: 0,
        questions: formatQuestions(),
    };

    // Convert API format dd/mm/yyyy to HTML input format yyyy-mm-dd
    const parseDate = (dateStr: string) => {
        if (!dateStr) return "";
        return dateStr.split("/").reverse().join("-");
    };

    const initialStateOverride: Partial<SurveyBuilderState> = {
        surveyId: enquete.id,
        currentStep: "info",
        isDirty: false,
        basicInfo: {
            title: enquete.titre,
            description: enquete.description || "",
            type_campagne: enquete.type_campagne,
            startDate: parseDate(enquete.date_debut),
            endDate: parseDate(enquete.date_fin),
        },
        themes: [initialTheme],
    };

    return (
        <SurveyBuilderProvider initialStateOverride={initialStateOverride}>
            <EditSurveyContent typesReponse={typesReponse} enquete={enquete} />
        </SurveyBuilderProvider>
    );
}
