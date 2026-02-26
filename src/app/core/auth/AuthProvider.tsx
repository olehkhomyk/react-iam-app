import React, { useCallback, useMemo } from "react";
import { authTokens } from "../api/authTokens";
import { AuthContext } from "./AuthContext";
import { GlobalSpinner } from "../components";
import { useUserQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } from "./auth.queries";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading: isUserLoading } = useUserQuery();
	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();
	const logoutMutation = useLogoutMutation();

	const login = useCallback(async (email: string, password: string) => {
		await loginMutation.mutateAsync({ email, password });
	}, [loginMutation]);

	const register = useCallback(async (email: string, password: string, username?: string) => {
		await registerMutation.mutateAsync({ email, password, username });
	}, [registerMutation]);

	const logout = useCallback(() => {
		logoutMutation.mutate();
	}, [logoutMutation]);

	const isAuthenticated = !!authTokens.getAccess() && !!user;

	const value = useMemo(
		() => ({
			user: user ?? null,
			isAuthenticated,
			login,
			register,
			logout,
		}),
		[user, isAuthenticated, login, register, logout]
	);

	const isInitializing = isUserLoading && !user;

	if (isInitializing) {
		return <GlobalSpinner/>;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
