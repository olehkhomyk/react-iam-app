// src/app/providers/ErrorNotificationProvider.tsx
import { useEffect } from "react";
import { toast } from "sonner";
import { HTTP_ERROR_EVENTS, httpErrorEventEmitter } from "@/shared/lib/httpErrorEventEmitter.ts";

export function ErrorNotificationProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const handler = (message: unknown) => {
			toast.error(message as string);
		};

		httpErrorEventEmitter.on(HTTP_ERROR_EVENTS.ERROR, handler);
		return () => httpErrorEventEmitter.off(HTTP_ERROR_EVENTS.ERROR, handler);
	}, []);

	return <>{children}</>;
}
