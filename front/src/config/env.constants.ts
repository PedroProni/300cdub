export const API_URL_DEFAULT = "http://localhost:57010/api";

export const API_PUBLIC_ORIGIN_DEFAULT = "http://localhost:57010";

export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? API_URL_DEFAULT;

export const API_PUBLIC_ORIGIN: string = (import.meta.env.VITE_API_PUBLIC_ORIGIN as string | undefined) ?? API_PUBLIC_ORIGIN_DEFAULT;

export const CREDITS_URL: string = (import.meta.env.VITE_CREDITS_URL as string | undefined) ?? "";
