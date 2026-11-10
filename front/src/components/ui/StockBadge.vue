<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { STOCK_BADGE_CLASSES, STOCK_BADGE_KEYS } from "@/components/ui/ui.constants";
import type { StockBadgeProps } from "@/components/ui/ui.types";

const props = defineProps<StockBadgeProps>();
const { t } = useI18n();
</script>

<template>
  <span
    :key="props.status"
    class="badge-pop inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
    :class="STOCK_BADGE_CLASSES[props.status]"
    data-testid="stock-badge"
  >
    {{ t(STOCK_BADGE_KEYS[props.status]) }}
  </span>
</template>
