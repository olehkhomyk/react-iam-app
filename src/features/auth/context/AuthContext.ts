import { createContext } from "react";
import type { UserProfile } from "../model/Auth.ts";
import type { LoginRequest, RegisterRequest } from "../model/AuthRequest.ts";

export type AuthUser = UserProfile;

export type AuthState = {
	user: AuthUser | null;
	isAuthenticated: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
