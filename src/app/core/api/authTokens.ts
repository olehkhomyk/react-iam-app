export type Tokens = {
    accessToken: string;
    refreshToken?: string;
};

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const authTokens = {
    getAccess(): string | null {
        return localStorage.getItem(ACCESS_KEY);
    },

    getRefresh(): string | null {
        return localStorage.getItem(REFRESH_KEY);
    },

    set(tokens: Tokens) {
        localStorage.setItem(ACCESS_KEY, tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    },

    clear() {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};
