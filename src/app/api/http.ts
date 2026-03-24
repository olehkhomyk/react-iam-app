import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authTokens } from '@/shared/lib/authTokens.ts';
import { authEventEmitter, AUTH_EVENTS } from '@/shared/lib/authEventEmitter.ts';
import { HTTP_ERROR_EVENTS, httpErrorEventEmitter } from '@/shared/lib/httpErrorEventEmitter.ts';
import { getErrorMessage } from '@/shared/lib/getErrorMessage.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const SKIP_REFRESH_URLS = ['/auth/login', '/auth/refresh', '/auth/register'];
const BEARER_PREFIX = 'Bearer';



export const http = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true,
    timeout: 30000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authTokens.getAccess();
    if (token) {
        config.headers.Authorization = `${BEARER_PREFIX} ${token}`;
    }
    return config;
});

function isAuthError(error: AxiosError) {
    const status = error.response?.status;
    return status === 401;
}

function shouldSkipRefresh(config?: InternalAxiosRequestConfig) {
    const url = config?.url ?? '';
    return SKIP_REFRESH_URLS.some(skip => url.includes(skip));
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = authTokens.getRefresh();
    if (!refreshToken) throw new Error('No refresh token');

    const plain = axios.create({ baseURL: API_BASE_URL });
    const res = await plain.get('/auth/refresh/token', { params: { token: refreshToken } });

    const tokens = res.data.payload || res.data;
    authTokens.set({
        accessToken: tokens.token,
        refreshToken: tokens.refreshToken
    });
    return tokens.token;
}


let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// --- Response interceptor: якщо 401 -> refresh -> retry ---
http.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
        const originalConfig = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalConfig || !isAuthError(err) || originalConfig._retry || shouldSkipRefresh(originalConfig)) {

            if (!isAuthError(err)) {
                const errorMessage = getErrorMessage(err);
                httpErrorEventEmitter.emit(HTTP_ERROR_EVENTS.ERROR, errorMessage);
            }

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
            originalConfig.headers.Authorization = `${BEARER_PREFIX} ${newAccessToken}`;

            return http.request(originalConfig);
        } catch (refreshErr) {
            // Refresh failed -> drop tokens and let app decide what to do (clear cache, navigate, etc.)
            authTokens.clear();
            authEventEmitter.emit(AUTH_EVENTS.FAILED, refreshErr);
            return Promise.reject(refreshErr);
        }
    }
);
