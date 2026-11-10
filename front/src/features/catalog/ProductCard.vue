<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import PriceTag from "@/components/ui/PriceTag.vue";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import StockBadge from "@/components/ui/StockBadge.vue";
import { ROUTE_NAMES } from "@/router/routes.constants";
import { FEATURED_CARD_SIZES, PRODUCT_CARD_SIZES } from "@/features/catalog/catalog.constants";
import type { ProductCardProps } from "@/features/catalog/catalog.types";

const props = withDefaults(defineProps<ProductCardProps>(), { eager: false, priority: false, featured: false });
const { t } = useI18n();
const imageClass = computed(() => `card-photo ${props.product.stockStatus === "sold_out" ? "brightness-50 saturate-50" : ""}`);
const cover = computed(() => props.product.images[0]?.urls ?? null);
const sizes = computed(() => (props.featured ? FEATURED_CARD_SIZES : PRODUCT_CARD_SIZES));
</script>

<template>
  <RouterLink :to="{ name: ROUTE_NAMES.product, params: { slug: props.product.slug } }" class="group flex h-full flex-col border border-edge bg-panel transition-colors duration-300 hover:border-accent/60 focus-visible:border-accent" data-testid="product-card">
    <div class="relative overflow-hidden bg-raised" :class="props.featured ? 'aspect-[16/11] lg:aspect-auto lg:min-h-0 lg:flex-1' : 'aspect-[4/5]'">
      <div class="absolute inset-0">
        <ResponsiveImage v-if="cover" :urls="cover" :alt="props.product.name" :sizes="sizes" :eager="props.eager" :priority="props.priority" :img-class="imageClass" />
        <div v-else class="micro-label flex size-full items-center justify-center">{{ t("catalog.noImage") }}</div>
      </div>
      <div class="absolute left-2 top-2"><StockBadge :status="props.product.stockStatus" /></div>
    </div>
    <div class="flex min-h-28 flex-col gap-2 border-t border-edge p-3">
      <h3 class="font-display-tight line-clamp-2 leading-[1.05] text-steel transition-colors group-hover:text-accent" :class="props.featured ? 'text-2xl font-bold' : 'text-xl font-semibold'">
        {{ props.product.name }}
      </h3>
      <div class="mt-auto"><PriceTag :price="props.product.price" :promo-price="props.product.promoPrice" /></div>
    </div>
  </RouterLink>
</template>
