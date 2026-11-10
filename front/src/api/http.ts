import { API_URL } from "@/config/env.constants";
import { ApiError } from "@/api/api-error";
import type { ApiErrorPayload, RequestOptions, UnauthorizedHandler } from "@/types/api.types";

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(API_URL.replace(/\/$/, "") + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseError(response: Response): Promise<ApiError> {
  let payload: ApiErrorPayload = {};
  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    payload = {};
  }
  const message = Array.isArray(payload.message) ? payload.message.join(", ") : (payload.message ?? response.statusText);
  return new ApiError(response.status, payload.code ?? null, message);
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), { method: options.method ?? "GET", headers, body, credentials: "include" });
  } catch {
    throw new ApiError(0, "network_error", "Network error");
  }
  if (!response.ok) {
    const error = await parseError(response);
    if (error.status === 401 && unauthorizedHandler) unauthorizedHandler();
    throw error;
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
