
 import React, { useEffect, useMemo, useState } from "react";
 import { authTokens } from "../api/authTokens";
 import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth.api";
 import type { AuthUser } from "./AuthContext";
 import { AuthContext } from "./AuthContext";

 const AUTH_USER_KEY = "auth_user";

 function readStoredUser(): AuthUser | null {
 	const raw = localStorage.getItem(AUTH_USER_KEY);
 	if (!raw) return null;
 	try {
 		return JSON.parse(raw) as AuthUser;
 	} catch {
 		localStorage.removeItem(AUTH_USER_KEY);
 		return null;
 	}
 }

 function storeUser(user: AuthUser | null) {
 	if (!user) {
 		localStorage.removeItem(AUTH_USER_KEY);
 		return;
 	}
 	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
 }
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = readStoredUser();
    const access = authTokens.getAccess();
    return access && storedUser ? storedUser : null;
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    const storedUser = readStoredUser();
    const access = authTokens.getAccess();

    if (!access || !storedUser) {
      authTokens.clear();
      storeUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const profile = await apiLogin({ email, password });
    if (!profile.token) throw new Error("Login response did not include token");
    authTokens.set({ accessToken: profile.token, refreshToken: profile.refreshToken });
    storeUser(profile);
    setUser(profile);
  };

  const register = async (email: string, password: string, username?: string) => {
    const profile = await apiRegister({ email, password, username });
    if (!profile.token) throw new Error("Register response did not include token");
    authTokens.set({ accessToken: profile.token, refreshToken: profile.refreshToken });
    storeUser(profile);
    setUser(profile);
  };

  const logout = () => {
    apiLogout();
    authTokens.clear();
    storeUser(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user && !!authTokens.getAccess(),
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
