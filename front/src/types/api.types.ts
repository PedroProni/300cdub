export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  method?: HttpMethod;
  query?: Record<string, QueryValue>;
  body?: unknown;
  form?: FormData;
}

export interface ApiErrorPayload {
  statusCode?: number;
  code?: string;
  message?: string | string[];
}

export type UnauthorizedHandler = () => void;
