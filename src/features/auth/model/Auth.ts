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
    lastLogin?: string;
    roles: Role[];
}

export interface TokenResponse {
    token: string;
    refreshToken: string;
}

export interface ApiResponse<T> {
    message: string;
    payload: T;
    success: boolean;
}

export type AuthResponse = ApiResponse<TokenResponse>;
export type UserResponse = ApiResponse<UserProfile>;
