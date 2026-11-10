import { createI18n } from "vue-i18n";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";
import { DEFAULT_LOCALE, HTML_LANG_BY_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from "@/i18n/i18n.constants";
import type { AppLocale } from "@/i18n/i18n.types";

function readStoredLocale(): AppLocale {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
  return SUPPORTED_LOCALES.includes(stored as AppLocale) ? (stored as AppLocale) : DEFAULT_LOCALE;
}

export const i18n = createI18n({ legacy: false, locale: readStoredLocale(), fallbackLocale: DEFAULT_LOCALE, messages: { pt, en } });

export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = HTML_LANG_BY_LOCALE[locale];
}

export function currentLocale(): AppLocale {
  return i18n.global.locale.value as AppLocale;
}
