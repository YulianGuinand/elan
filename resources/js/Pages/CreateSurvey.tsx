import FadeIn from "@/Components/Animations/FadeIn";
import Stepper from "@/Components/Common/Stepper";
import PageHead from "@/Components/Seo/PageHead";
import SurveyBasicInfo from "@/Components/SurveyBuilder/SurveyBasicInfo";
import SurveyBuilder from "@/Components/SurveyBuilder/SurveyBuilder";
import SurveyPreview from "@/Components/SurveyBuilder/SurveyPreview";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    SurveyBuilderProvider,
    useSurveyBuilder,
} from "@/contexts/SurveyBuilderContext";
import { TypeReponse } from "@/types/surveys";

function CreateSurveyContent({
    typesReponse,
}: {
    typesReponse: TypeReponse[];
}) {
    const { state } = useSurveyBuilder();

    return (
        <>
            <PageHead
                title="Créer une Enquête"
                description="Construisez votre enquête CFA avec notre interface intuitive. Multiples types de questions, conditions logiques et conformité Qualiopi."
                keywords="créer enquête, constructeur enquête, questions, Qualiopi"
            />

            <DashboardLayout
                title="Créer une enquête"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Créer" },
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
export default function CreateSurvey({
    typesReponse,
}: {
    typesReponse: TypeReponse[];
}) {
    return (
        <SurveyBuilderProvider>
            <CreateSurveyContent typesReponse={typesReponse} />
        </SurveyBuilderProvider>
    );
}
