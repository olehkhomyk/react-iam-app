import { EventEmitter } from "@/shared/lib/EventEmitter.ts";

export const authEventEmitter = new EventEmitter();
export const AUTH_EVENTS = {
	FAILED: 'auth:failed',
	SUCCESS: 'auth:success',
} as const;
