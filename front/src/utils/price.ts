import { CURRENCY_CODE, INTL_LOCALE_BY_LOCALE } from "@/utils/price.constants";
import type { AppLocale } from "@/i18n/i18n.types";

export function formatPrice(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(INTL_LOCALE_BY_LOCALE[locale], { style: "currency", currency: CURRENCY_CODE }).format(value);
}

export function discountPercent(price: number, promoPrice: number | null): number {
  if (promoPrice === null || promoPrice >= price || price <= 0) return 0;
  return Math.round(((price - promoPrice) / price) * 100);
}

export function effectivePrice(price: number, promoPrice: number | null): number {
  return promoPrice !== null && promoPrice < price ? promoPrice : price;
}
