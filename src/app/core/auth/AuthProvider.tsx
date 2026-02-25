import React, { useCallback, useEffect, useMemo, useState } from "react";
import { authTokens } from "../api/authTokens";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "../api/auth.api";
import type { AuthUser } from "./AuthContext";
import { AuthContext } from "./AuthContext";
import { GlobalSpinner } from "../components";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	const refreshUser = useCallback(async () => {
		const userData = await getCurrentUser();
		setUser(userData);
	}, []);

	useEffect(() => {
		const initAuth = async () => {
			const accessToken = authTokens.getAccess();

			if (!accessToken) {
				setIsInitializing(false);
				return;
			}

			try {
				await refreshUser();
			} catch (error) {
				console.error("Failed to fetch user:", error);
				authTokens.clear();
				setUser(null);
			} finally {
				setIsInitializing(false);
			}
		};

		initAuth();
	}, [refreshUser]);

	const login = useCallback(async (email: string, password: string) => {
		const tokens = await apiLogin({ email, password });
		authTokens.set({ accessToken: tokens.token, refreshToken: tokens.refreshToken });

		try {
			await refreshUser();
		} catch (error) {
			// If we cannot fetch the current user after login, treat it as an auth failure.
			authTokens.clear();
			setUser(null);
			throw error;
		}
	}, [refreshUser]);

	const register = useCallback(async (email: string, password: string, username?: string) => {
		const tokens = await apiRegister({ email, password, username });
		authTokens.set({ accessToken: tokens.token, refreshToken: tokens.refreshToken });

		try {
			await refreshUser();
		} catch (error) {
			authTokens.clear();
			setUser(null);
			throw error;
		}
	}, [refreshUser]);

	const logout = useCallback(() => {
		// Best-effort server logout; always clear local auth state.
		try {
			apiLogout();
		} finally {
			authTokens.clear();
			setUser(null);
		}
	}, []);

	const isAuthenticated = !!authTokens.getAccess() && !!user;

	const value = useMemo(
		() => ({
			user,
			isAuthenticated,
			login,
			register,
			logout,
		}),
		[user, isAuthenticated, login, register, logout]
	);

	if (isInitializing) {
		return <GlobalSpinner/>;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
