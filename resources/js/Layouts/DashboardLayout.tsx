import { ToastContainer, useToastManager } from "@/Components/Common/Toast";
import Header from "@/Components/Dashboard/Header";
import Sidebar from "@/Components/Dashboard/Sidebar";
import OnboardingStepper from "@/Components/Onboarding/OnboardingStepper";
import useRefreshOnLogin from "@/Hooks/useRefreshOnLogin";
import { useUnreadNotificationCount } from "@/Hooks/useUnreadNotificationCount";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface DashboardLayoutProps extends PropsWithChildren {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    actionButton?: {
        icon?: ReactElement;
        label: string;
        href?: string;
        onClick?: () => void;
    };
    noPadding?: boolean;
}

export default function DashboardLayout({
    title,
    breadcrumbs,
    actionButton,
    children,
    noPadding = false,
}: DashboardLayoutProps) {
    // Refrais automatique de la page une fois après la connexion
    useRefreshOnLogin();

    const { auth, flash, errors } = usePage<PageProps>().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toasts, add, remove } = useToastManager();
    const { unreadCount } = useUnreadNotificationCount();

    // FLASH
    useEffect(() => {
        if (flash?.success) add(flash.success, "success");
        if (flash?.error) add(flash.error, "error");
        if (flash?.message) add(flash.message, "info");

        if (errors && Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            add(firstError, "error");
        }
    }, [flash, errors]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onRemove={remove} />

            {/* Sidebar */}
            <Sidebar
                userName={user?.name}
                userRole={user?.role}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                unreadNotificationCount={unreadCount}
            />

            {/* Main Content */}
            <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Header */}
                <Header
                    title={title}
                    breadcrumbs={breadcrumbs}
                    actionButton={actionButton}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page Content */}
                <main
                    className={`flex-1 flex gap-4 ${
                        noPadding ? "" : "px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
                    }`}
                >
                    {children}
                </main>
            </div>

            {/* Onboarding Stepper */}
            <OnboardingStepper />
        </div>
    );
}
