<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import PriceTag from "@/components/ui/PriceTag.vue";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import StockBadge from "@/components/ui/StockBadge.vue";
import { ROUTE_NAMES } from "@/router/routes.constants";
import { PRODUCT_CARD_SIZES } from "@/features/catalog/catalog.constants";
import type { ProductCardProps } from "@/features/catalog/catalog.types";

const props = withDefaults(defineProps<ProductCardProps>(), { eager: false, priority: false });
const { t } = useI18n();
const imageClass = computed(() => `transition-transform duration-500 group-hover:scale-105 ${props.product.stockStatus === "sold_out" ? "brightness-50 saturate-50" : ""}`);
const cover = computed(() => props.product.images[0]?.urls ?? null);
</script>

<template>
  <RouterLink :to="{ name: ROUTE_NAMES.product, params: { slug: props.product.slug } }" class="metal-card press group block overflow-hidden rounded-xl">
    <div class="relative aspect-square overflow-hidden bg-raised">
      <ResponsiveImage v-if="cover" :urls="cover" :alt="props.product.name" :sizes="PRODUCT_CARD_SIZES" :eager="props.eager" :priority="props.priority" :img-class="imageClass" />
      <div v-else class="font-display-tight flex size-full items-center justify-center text-sm text-muted">{{ t("catalog.noImage") }}</div>
      <div class="absolute left-2 top-2"><StockBadge :status="props.product.stockStatus" /></div>
    </div>
    <div class="flex h-24 flex-col gap-1.5 p-3">
      <h3 class="line-clamp-2 text-sm font-semibold text-steel">{{ props.product.name }}</h3>
      <PriceTag :price="props.product.price" :promo-price="props.product.promoPrice" />
    </div>
  </RouterLink>
</template>
