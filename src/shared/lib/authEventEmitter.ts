type EventHandler<T = any> = (data: T) => void;

class EventEmitter {
	private events = new Map<string, Set<EventHandler>>();

	on(event: string, handler: EventHandler) {
		if (!this.events.has(event)) {
			this.events.set(event, new Set());
		}
		this.events.get(event)!.add(handler);
	}

	off(event: string, handler: EventHandler) {
		this.events.get(event)?.delete(handler);
	}

	emit(event: string, data: unknown) {
		this.events.get(event)?.forEach(handler => handler(data));
	}
}

export const authEventEmitter = new EventEmitter();
export const AUTH_EVENTS = {
	FAILED: 'auth:failed',
	SUCCESS: 'auth:success',
} as const;
