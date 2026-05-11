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
import { SurveyBuilderState, Theme } from "@/types/surveyBuilder";
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
                <div className="space-y-6 w-full">
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
    // Convert API format dd/mm/yyyy to HTML input format yyyy-mm-dd
    const parseDate = (dateStr: string) => {
        if (!dateStr) return "";
        return dateStr.split("/").reverse().join("-");
    };

    const initialThemes: Theme[] =
        enquete.themes?.map((t: any) => ({
            id: nanoid(),
            title: t.libelle,
            description: "",
            order: t.ordre || 0,
            questions: t.questions.map((q: any, idx: number) => {
                let builderType = q.type_reponse || "text";

                return {
                    id: nanoid(),
                    type: builderType as any,
                    label: q.libelle,
                    required: q.required || false,
                    order: q.numero || idx,
                    likertStyle: q.likert_style || "emoji",
                    options: q.choix
                        ? q.choix.map((c: any) => ({
                              id: nanoid(),
                              label: c.libelle,
                              value: c.libelle,
                          }))
                        : undefined,
                };
            }),
        })) || [];

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
        themes:
            initialThemes.length > 0
                ? initialThemes
                : [
                      {
                          id: nanoid(),
                          title: "Questions de l'enquête",
                          description: "",
                          order: 0,
                          questions: [],
                      },
                  ],
    };

    return (
        <SurveyBuilderProvider initialStateOverride={initialStateOverride}>
            <EditSurveyContent typesReponse={typesReponse} enquete={enquete} />
        </SurveyBuilderProvider>
    );
}
