import React, { useCallback, useEffect, useMemo } from "react";
import { authTokens } from "@/shared/lib/authTokens.ts";
import { AuthContext } from "./AuthContext.ts";
import {
	useUserQuery, useLoginMutation, useRegisterMutation, useLogoutMutation, AUTH_QUERY_KEY
} from "@/features/auth/queries/auth.queries.ts";
import { queryClient } from "@/app/api/queryClient.ts";
import { AUTH_EVENTS, authEventEmitter } from "@/shared/lib/authEventEmitter.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import type { LoginRequest, RegisterRequest } from "../model/auth.types.ts";

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

	const login = useCallback(async (credentials: LoginRequest) => {
		await loginMutation.mutateAsync(credentials);
	}, [loginMutation]);

	const register = useCallback(async (data: RegisterRequest) => {
		await registerMutation.mutateAsync(data);
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
		return (
			<div className="flex items-center justify-center min-h-screen bg-background/50">
				<Spinner className="size-8"/>
			</div>
		);
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
