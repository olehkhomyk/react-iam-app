type EventHandler<T = any> = (data: T) => void;

export class EventEmitter {
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