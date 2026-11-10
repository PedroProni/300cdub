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
    <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="font-display-tight inline-flex min-h-11 items-center rounded-sm bg-accent-fill px-5 text-lg font-bold text-black">{{
      t("product.notFound.back")
    }}</RouterLink>
  </EmptyState>
  <EmptyState v-else-if="store.failed" :title="t('errors.generic')"
    ><BaseButton variant="secondary" @click="store.load(props.slug)">{{ t("common.retry") }}</BaseButton></EmptyState
  >
  <article v-else-if="product" class="grid gap-8 lg:grid-cols-12 lg:gap-12">
    <div class="lg:col-span-7"><ProductGallery :images="product.images" :alt="product.name" /></div>
    <div class="flex flex-col gap-5 lg:sticky lg:top-20 lg:col-span-5 lg:self-start" data-testid="product-info">
      <p v-if="product.category" class="micro-label flex items-center gap-2 text-accent"><span class="size-2 bg-accent" aria-hidden="true" />{{ product.category.name }}</p>
      <h1 class="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-steel sm:text-6xl">{{ product.name }}</h1>
      <div class="flex flex-wrap items-center gap-3 border-y border-edge py-4"><PriceTag :price="product.price" :promo-price="product.promoPrice" large /><StockBadge :status="product.stockStatus" /></div>
      <p v-if="product.description" class="whitespace-pre-line text-sm leading-relaxed text-muted">{{ product.description }}</p>
      <ProductPurchase :key="product.id" :product="product" />
    </div>
  </article>
</template>
