import { http } from "./http";
import {authTokens} from "./authTokens.ts";
import type { AuthResponse } from "./types";


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
export async function login(credentials: LoginRequest): Promise<AuthResponse['payload']> {
    const response = await http.post<AuthResponse>("/auth/login", credentials);
    return response.data.payload;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse['payload']> {
    const response = await http.post<AuthResponse>("/auth/register", userData);
    return response.data.payload;
}

/**
 * Logout user - clears tokens on the server side
 * Note: You should also clear local tokens using authTokens.clear()
 */
export function logout(): void {
    authTokens.clear();
}