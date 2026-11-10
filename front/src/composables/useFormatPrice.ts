import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatPrice } from "@/utils/price";
import type { AppLocale } from "@/i18n/i18n.types";

export function useFormatPrice() {
  const { locale } = useI18n();
  const format = computed(() => (value: number) => formatPrice(value, locale.value as AppLocale));
  return (value: number) => format.value(value);
}
