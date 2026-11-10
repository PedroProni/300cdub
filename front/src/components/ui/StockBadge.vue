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
    class="badge-pop micro-label inline-flex items-center rounded-sm border bg-ink/80 px-2 py-0.5 text-[10px] backdrop-blur-sm"
    :class="STOCK_BADGE_CLASSES[props.status]"
    data-testid="stock-badge"
  >
    {{ t(STOCK_BADGE_KEYS[props.status]) }}
  </span>
</template>
