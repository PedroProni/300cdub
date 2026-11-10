import { API_PUBLIC_ORIGIN_DEFAULT, API_URL_DEFAULT } from "@/config/env.constants";

export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? API_URL_DEFAULT;

export const API_PUBLIC_ORIGIN: string = (import.meta.env.VITE_API_PUBLIC_ORIGIN as string | undefined) ?? API_PUBLIC_ORIGIN_DEFAULT;
