<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFormatPrice } from "@/composables/useFormatPrice";
import { discountPercent } from "@/utils/price";
import type { PriceTagProps } from "@/components/ui/ui.types";

const props = defineProps<PriceTagProps>();
const { t } = useI18n();
const format = useFormatPrice();
const percent = computed(() => discountPercent(props.price, props.promoPrice));
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
    <template v-if="percent > 0 && props.promoPrice !== null">
      <span class="font-mono font-medium tracking-tight text-steel" :class="props.large ? 'text-3xl' : 'text-base'" data-testid="price-current">{{ format(props.promoPrice) }}</span>
      <s class="text-sm text-muted" data-testid="price-old">{{ format(props.price) }}</s>
      <span class="rounded-sm bg-accent px-1.5 py-0.5 text-[11px] font-medium text-black" data-testid="price-discount">{{ t("product.discount", { percent }) }}</span>
    </template>
    <span v-else class="font-mono font-medium tracking-tight text-steel" :class="props.large ? 'text-3xl' : 'text-base'" data-testid="price-current">{{ format(props.price) }}</span>
  </div>
</template>
