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
import { Head } from "@inertiajs/react";

function CreateSurveyContent() {
    const { state } = useSurveyBuilder();

    return (
        <>
            <Head title="Créer une enquête" />

            <DashboardLayout
                title="Créer une enquête"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Créer" },
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

                    {state.currentStep === "preview" && <SurveyPreview />}
                </div>
            </DashboardLayout>
        </>
    );
}

export default function CreateSurvey() {
    return (
        <SurveyBuilderProvider>
            <CreateSurveyContent />
        </SurveyBuilderProvider>
    );
}
