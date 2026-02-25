import { http } from "./http";
import {authTokens} from "./authTokens.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>("/auth/login", credentials);
    return response.data;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>("/auth/register", userData);
    return response.data;
}

/**
 * Logout user - clears tokens on the server side
 * Note: You should also clear local tokens using authTokens.clear()
 */
export function logout(): void {
    authTokens.clear();
}