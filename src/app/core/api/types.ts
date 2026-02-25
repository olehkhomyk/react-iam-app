export enum RegistrationStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export interface Role {
    id: number;
    name: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    registrationStatus: RegistrationStatus;
    lastLogin?: string; // LocalDateTime from backend will be string in JSON
    refreshToken?: string;
    token?: string;
    roles: Role[];
}

export interface ApiResponse<T> {
    message: string;
    payload: T;
    success: boolean;
}

export type AuthResponse = ApiResponse<UserProfile>;
