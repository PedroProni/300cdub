<script setup lang="ts">
import { computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import PriceTag from "@/components/ui/PriceTag.vue";
import StockBadge from "@/components/ui/StockBadge.vue";
import ProductSkeleton from "@/features/product/ProductSkeleton.vue";
import ProductGallery from "@/features/product/ProductGallery.vue";
import ProductPurchase from "@/features/product/ProductPurchase.vue";
import { useProductStore } from "@/features/product/product.store";
import { useHead } from "@/composables/useHead";
import { ROUTE_NAMES } from "@/router/routes.constants";
import type { SlugProps } from "@/features/product/product-view.types";

const props = defineProps<SlugProps>();
const { t } = useI18n();
const store = useProductStore();

watch(
  () => props.slug,
  (slug) => store.load(slug),
  { immediate: true },
);

useHead({
  title: () => (store.product ? `${store.product.name} | ${t("brand.name")}` : t("brand.name")),
  description: () => store.product?.description.slice(0, 160) ?? "",
});

const product = computed(() => store.product);
</script>

<template>
  <ProductSkeleton v-if="store.loading" />
  <EmptyState v-else-if="store.notFound" :title="t('product.notFound.title')" :description="t('product.notFound.description')">
    <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="font-display-tight inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-black">{{
      t("product.notFound.back")
    }}</RouterLink>
  </EmptyState>
  <EmptyState v-else-if="store.failed" :title="t('errors.generic')"
    ><BaseButton variant="secondary" @click="store.load(props.slug)">{{ t("common.retry") }}</BaseButton></EmptyState
  >
  <article v-else-if="product" class="grid gap-8 md:grid-cols-2">
    <ProductGallery :images="product.images" :alt="product.name" />
    <div class="flex flex-col gap-4">
      <p v-if="product.category" class="text-xs font-semibold uppercase tracking-widest text-accent">{{ product.category.name }}</p>
      <h1 class="font-display-tight text-3xl font-bold text-steel">{{ product.name }}</h1>
      <div class="flex flex-wrap items-center gap-3"><PriceTag :price="product.price" :promo-price="product.promoPrice" large /><StockBadge :status="product.stockStatus" /></div>
      <p v-if="product.description" class="whitespace-pre-line text-muted">{{ product.description }}</p>
      <ProductPurchase :key="product.id" :product="product" />
    </div>
  </article>
</template>
