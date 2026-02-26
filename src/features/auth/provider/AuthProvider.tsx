import React, { useCallback, useEffect, useMemo } from "react";
import { authTokens } from "../../../shared/lib/authTokens.ts";
import { AuthContext } from "../context/AuthContext.ts";
import { GlobalSpinner } from "../../../shared/ui/GlobalSpinner.tsx";
import {
	useUserQuery, useLoginMutation, useRegisterMutation, useLogoutMutation, AUTH_QUERY_KEY
} from "../store/auth.queries.ts";
import { queryClient } from "../../../app/api/queryClient.ts";
import { AUTH_EVENTS, authEventEmitter } from "../../../shared/lib/authEventEmitter.ts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading: isUserLoading } = useUserQuery();
	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();
	const logoutMutation = useLogoutMutation();

	useEffect(() => {
		const handler = () => {
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
		};

		authEventEmitter.on(AUTH_EVENTS.FAILED, handler);
		return () => authEventEmitter.off(AUTH_EVENTS.FAILED, handler);
	}, []);

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
