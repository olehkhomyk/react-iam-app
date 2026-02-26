import { http } from "../../../app/api/http.ts";
import {authTokens} from "../../../shared/lib/authTokens.ts";
import type { AuthResponse, UserResponse, TokenResponse, UserProfile } from "../model/Auth.ts";


export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username?: string;
}
/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await http.post<AuthResponse>("/auth/login", credentials);
    return response.data.payload;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<TokenResponse> {
    const response = await http.post<AuthResponse>("/auth/register", userData);
    return response.data.payload;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<UserProfile> {
    const response = await http.get<UserResponse>("/users/me");
    return response.data.payload;
}

/**
 * Logout user - clears tokens on the server side
 * Note: You should also clear local tokens using authTokens.clear()
 */
export function logout(): void {
    authTokens.clear();
}