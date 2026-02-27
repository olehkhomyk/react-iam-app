import { EventEmitter } from "@/shared/lib/EventEmitter.ts";

export const httpErrorEventEmitter = new EventEmitter();
export const HTTP_ERROR_EVENTS = {
	ERROR: 'http:error'
} as const;