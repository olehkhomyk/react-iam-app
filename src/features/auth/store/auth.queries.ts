import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login as apiLogin, register as apiRegister } from "../api/auth.api.ts";
import { authTokens } from "@/shared/lib/authTokens.ts";
import type { LoginRequest, RegisterRequest } from "../model/AuthRequest.ts";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useUserQuery() {
	const accessToken = authTokens.getAccess();
	
	return useQuery({
		queryKey: AUTH_QUERY_KEY,
		queryFn: getCurrentUser,
		enabled: !!accessToken,
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
}

export function useLoginMutation() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (credentials: LoginRequest) => {
			const tokens = await apiLogin(credentials);
			authTokens.set({ accessToken: tokens.token, refreshToken: tokens.refreshToken });
			return tokens;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
		},
		onError: () => {
			authTokens.clear();
		},
	});
}

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (userData: RegisterRequest) => {
			const tokens = await apiRegister(userData);
			authTokens.set({ accessToken: tokens.token, refreshToken: tokens.refreshToken });
			return tokens;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
		},
		onError: () => {
			authTokens.clear();
		},
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async () => {
			authTokens.clear();
		},
		onSuccess: () => {
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
			queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
		},
	});
}
