import Header from "@/Components/Dashboard/Header";
import Sidebar from "@/Components/Dashboard/Sidebar";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, useState } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DashboardLayoutProps extends PropsWithChildren {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    actionButton?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export default function DashboardLayout({
    title,
    breadcrumbs,
    actionButton,
    children,
}: DashboardLayoutProps) {
    const user = usePage().props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                userName={user?.name}
                userRole="Admin"
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
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
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
