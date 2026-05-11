export type StudentStatus = "active" | "graduated" | "paused" | "suspended";
export type ProgramType =
    | "web_dev"
    | "cybersecurity"
    | "data_analyst"
    | "mobile_dev"
    | "ux_ui";

export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    avatar?: string;
    program: string;
    program_type: ProgramType;
    status: StudentStatus;
    enrollment_date: string;
}

export interface StudentFilters {
    search: string;
    program: ProgramType | "all";
    status: StudentStatus | "all";
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface PaginatedStudents {
    data: Student[];
    meta: PaginationMeta;
}
