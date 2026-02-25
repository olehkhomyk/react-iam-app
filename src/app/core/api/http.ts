import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authTokens } from "./authTokens";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const SKIP_REFRESH_URLS = ['/auth/login', '/auth/refresh', '/auth/register'];
const BAREAR_PREFIX = 'Bearer';

export const http = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true,
    timeout: 15000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authTokens.getAccess();
    if (token) {
        config.headers.Authorization = `${BAREAR_PREFIX} ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function isAuthError(error: AxiosError) {
    const status = error.response?.status;
    return status === 401;
}

function shouldSkipRefresh(config?: InternalAxiosRequestConfig) {
    const url = config?.url ?? "";
    return SKIP_REFRESH_URLS.some(skip => url.includes(skip));
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = authTokens.getRefresh();
    if (!refreshToken) throw new Error("No refresh token");

    const plain = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

    const res = await plain.post("/auth/refresh", { refreshToken });
    // очікую формат { accessToken, refreshToken? }
    authTokens.set(res.data);
    return res.data.accessToken as string;
}

// --- Response interceptor: якщо 401 -> refresh -> retry ---
http.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
        const originalConfig = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalConfig || !isAuthError(err) || originalConfig._retry || shouldSkipRefresh(originalConfig)) {
            return Promise.reject(err);
        }

        originalConfig._retry = true;

        try {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise!;
            originalConfig.headers = originalConfig.headers ?? {};
            originalConfig.headers.Authorization = `${BAREAR_PREFIX} ${newAccessToken}`;

            return http.request(originalConfig);
        } catch (refreshErr) {
            authTokens.clear();
            return Promise.reject(refreshErr);
        }
    }
);
