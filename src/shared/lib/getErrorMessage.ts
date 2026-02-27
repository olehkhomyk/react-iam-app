import axios from "axios";

type ApiErrorBody =
	| { error?: string; message?: string }
	| Record<string, unknown>;


export function getErrorMessage(err: unknown): string {
	if (typeof err === "string") return err;

	const axiosMessage = extractMessageFromAxiosError(err);
	if (axiosMessage) return axiosMessage;

	if (err instanceof Error) return err.message;

	const objectMessage = extractMessageFromUnknownObject(err);
	if (objectMessage) return objectMessage;

	return "Something went wrong";
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function pickString(value: unknown): string | undefined {
	return isNonEmptyString(value) ? value : undefined;
}

function extractMessageFromApiData(data: ApiErrorBody | string | undefined): string | undefined {
	if (!data) return undefined;
	if (isNonEmptyString(data)) return data;
	if (typeof data !== "object") return undefined;

	const d = data as any;
	return (
		pickString(d.error) ||
		pickString(d.message) ||
		pickString(d.errorCode) ||
		pickString(d.payload?.error) ||
		pickString(d.payload?.message) ||
		pickString(d.payload?.errorCode)
	);
}

function extractMessageFromAxiosError(err: unknown): string | undefined {
	if (!axios.isAxiosError(err)) return undefined;

	const data = err.response?.data as ApiErrorBody | string | undefined;
	const fromBody = extractMessageFromApiData(data);
	if (fromBody) return fromBody;

	if (isNonEmptyString(err.message)) return err.message;

	const status = err.response?.status;
	if (status) return `Request failed (${status})`;

	return "Network error";
}

function extractMessageFromUnknownObject(err: unknown): string | undefined {
	if (!err || typeof err !== "object") return undefined;
	const anyErr = err as any;
	return pickString(anyErr.message) || pickString(anyErr.error);
}
