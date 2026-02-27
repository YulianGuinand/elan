import FadeIn from "@/Components/Animations/FadeIn";
import AccountSettings from "@/Components/Settings/AccountSettings";
import GeneralSettings from "@/Components/Settings/GeneralSettings";
import IntegrationSettings from "@/Components/Settings/IntegrationSettings";
import NotificationSettings from "@/Components/Settings/NotificationSettings";
import ProfileHeader from "@/Components/Settings/ProfileHeader";
import SecuritySettings from "@/Components/Settings/SecuritySettings";
import SettingsTabs from "@/Components/Settings/SettingsTabs";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    GeneralSettings as GeneralSettingsType,
    NotificationPreferences,
    SettingsTab,
    UserSettings,
} from "@/types/settings";
import { Head } from "@inertiajs/react";
import { useState } from "react";

interface SettingsProps {
    user: UserSettings;
    notifications: NotificationPreferences;
    general: GeneralSettingsType;
}

export default function Settings({
    user,
    notifications,
    general,
}: SettingsProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("account");

    const handlePhotoChange = () => {
        // Upload de photo - à implémenter
        console.log("Upload photo");
    };

    return (
        <>
            <Head title="Paramètres" />

            <DashboardLayout
                title="Paramètres"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Paramètres" },
                ]}
            >
                <div className="space-y-6">
                    {/* Description */}
                    <FadeIn delay={0}>
                        <p className="text-gray-600">
                            Gérez vos préférences de compte, les notifications
                            et la configuration globale.
                        </p>
                    </FadeIn>

                    {/* Navigation par onglets */}
                    <FadeIn delay={100}>
                        <SettingsTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </FadeIn>

                    {/* Contenu des onglets */}
                    {activeTab === "account" && (
                        <div className="space-y-6">
                            <FadeIn delay={150}>
                                <ProfileHeader
                                    user={user}
                                    onPhotoChange={handlePhotoChange}
                                />
                            </FadeIn>
                            <FadeIn delay={200}>
                                <AccountSettings user={user} />
                            </FadeIn>
                            <FadeIn delay={250}>
                                <SecuritySettings user={user} />
                            </FadeIn>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <FadeIn delay={150}>
                            <NotificationSettings preferences={notifications} />
                        </FadeIn>
                    )}

                    {activeTab === "general" && (
                        <FadeIn delay={150}>
                            <GeneralSettings settings={general} user={user} />
                        </FadeIn>
                    )}

                    {activeTab === "integrations" && (
                        <FadeIn delay={150}>
                            <IntegrationSettings />
                        </FadeIn>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
