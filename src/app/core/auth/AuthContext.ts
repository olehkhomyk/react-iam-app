import { createContext } from "react";
import type { UserProfile } from "../api/types";

export type AuthUser = Omit<UserProfile, "token" | "refreshToken">;

export type AuthState = {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, username?: string) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
