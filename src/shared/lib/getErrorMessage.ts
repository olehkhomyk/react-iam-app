import axios from "axios";

type ApiErrorBody =
	| { error?: string; message?: string }
	| Record<string, unknown>;

export function getErrorMessage(err: unknown): string {
	if (typeof err === "string") return err;

	if (axios.isAxiosError(err)) {
		// 1) якщо бекенд присилає { error: "..." } або { message: "..." }
		const data = err.response?.data as ApiErrorBody | undefined;
		const fromBody =
			typeof data === "object" && data
				? (typeof (data as any).error === "string" && (data as any).error) ||
				(typeof (data as any).message === "string" && (data as any).message)
				: undefined;

		if (fromBody) return fromBody;

		if (typeof err.message === "string" && err.message) return err.message;

		const status = err.response?.status;
		if (status) return `Request failed (${status})`;

		return "Network error";
	}

	if (err instanceof Error) return err.message;

	return "Something went wrong";
}