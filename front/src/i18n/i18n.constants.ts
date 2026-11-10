import type { AppLocale } from "@/i18n/i18n.types";

export const SUPPORTED_LOCALES: AppLocale[] = ["pt", "en"];

export const DEFAULT_LOCALE: AppLocale = "pt";

export const LOCALE_STORAGE_KEY = "cdub.locale";

export const HTML_LANG_BY_LOCALE: Record<AppLocale, string> = { pt: "pt-BR", en: "en" };

export const LOCALE_LABEL_KEYS: Record<AppLocale, string> = { pt: "language.pt", en: "language.en" };
