import { createContext } from "react";
import type { LoginRequest, RegisterRequest, UserProfile } from "../model/auth.types.ts";

export type AuthUser = UserProfile;

export type AuthState = {
	user: AuthUser | null;
	isAuthenticated: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
