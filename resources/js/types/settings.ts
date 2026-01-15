export interface UserSettings {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    avatar?: string;
    two_factor_enabled: boolean;
}

export interface AccountFormData {
    first_name: string;
    last_name: string;
    email: string;
}

export interface SecurityFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface NotificationPreferences {
    email_notifications: boolean;
    survey_reminders: boolean;
    response_alerts: boolean;
    weekly_reports: boolean;
    system_updates: boolean;
}

export interface GeneralSettings {
    language: string;
    timezone: string;
    date_format: string;
    items_per_page: number;
}

export type SettingsTab =
    | "account"
    | "notifications"
    | "general"
    | "integrations";
