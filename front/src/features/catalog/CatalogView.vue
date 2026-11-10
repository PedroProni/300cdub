<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import EmptyState from "@/components/ui/EmptyState.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import SkeletonGrid from "@/components/ui/SkeletonGrid.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import CategoryChips from "@/features/catalog/CategoryChips.vue";
import CatalogToolbar from "@/features/catalog/CatalogToolbar.vue";
import ProductCard from "@/features/catalog/ProductCard.vue";
import { useCatalogStore } from "@/features/catalog/catalog.store";
import { CATALOG_PAGE_SIZE, DEFAULT_SORT, EAGER_CARD_COUNT, LOAD_MORE_ROOT_MARGIN, SORT_OPTIONS } from "@/features/catalog/catalog.constants";
import { useHead } from "@/composables/useHead";
import { useIntersectionTrigger } from "@/composables/useIntersectionTrigger";
import type { ProductQuery, ProductSort } from "@/types/product.types";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();

useHead({ title: () => t("catalog.metaTitle"), description: () => t("catalog.metaDescription") });

function single(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const category = computed(() => single(route.query.category));
const search = computed(() => single(route.query.search));
const sort = computed<ProductSort>(() => {
  const value = single(route.query.sort);
  return SORT_OPTIONS.some((option) => option.value === value) ? (value as ProductSort) : DEFAULT_SORT;
});
const sentinel = ref<HTMLElement | null>(null);
const filtered = computed(() => category.value !== "" || search.value !== "");

function currentQuery(): ProductQuery {
  return { category: category.value || undefined, search: search.value || undefined, sort: sort.value, limit: CATALOG_PAGE_SIZE };
}

function load(): void {
  catalog.search({ ...currentQuery(), page: 1 });
}

function loadMore(): void {
  catalog.loadMore(currentQuery());
}

useIntersectionTrigger(
  sentinel,
  () => {
    if (!catalog.moreFailed) loadMore();
  },
  LOAD_MORE_ROOT_MARGIN,
);

function update(next: Record<string, string | number | undefined>): void {
  const merged: Record<string, string> = {};
  const values = { category: category.value, search: search.value, sort: sort.value === DEFAULT_SORT ? "" : sort.value, ...next };
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") merged[key] = String(value);
  }
  router.replace({ query: merged });
}

function clearFilters(): void {
  router.replace({ query: {} });
}

catalog.loadCategories();
load();
watch(() => [category.value, search.value, sort.value], load);
</script>

<template>
  <div class="flex flex-col gap-5">
    <h1 class="font-display-tight text-3xl font-bold text-steel">{{ t("catalog.title") }}</h1>
    <div class="min-h-11"><CategoryChips v-if="catalog.categories.length > 0" :categories="catalog.categories" :selected="category" @select="update({ category: $event })" /></div>
    <CatalogToolbar :search="search" :sort="sort" @update:search="update({ search: $event })" @update:sort="update({ sort: $event === DEFAULT_SORT ? '' : $event })" />
    <p class="text-sm text-muted" aria-live="polite">{{ t("catalog.results", { count: catalog.total }) }}</p>
    <SkeletonGrid v-if="catalog.loading" :count="CATALOG_PAGE_SIZE" />
    <EmptyState v-else-if="catalog.failed" :title="t('errors.generic')" :description="t('catalog.loadFailed')"
      ><BaseButton variant="secondary" @click="load">{{ t("common.retry") }}</BaseButton></EmptyState
    >
    <EmptyState v-else-if="catalog.items.length === 0" :title="t('catalog.empty.title')" :description="t('catalog.empty.description')">
      <BaseButton v-if="filtered" variant="secondary" @click="clearFilters">{{ t("catalog.clearFilters") }}</BaseButton>
    </EmptyState>
    <template v-else>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <ProductCard
          v-for="(product, position) in catalog.items"
          :key="product.id"
          :product="product"
          :eager="position < EAGER_CARD_COUNT"
          :priority="position < EAGER_CARD_COUNT"
        />
        <template v-if="catalog.loadingMore"><SkeletonCard v-for="n in 4" :key="`more-${n}`" /></template>
      </div>
      <div v-if="catalog.hasMore || catalog.loadingMore" class="flex flex-col items-center gap-3 py-4">
        <p v-if="catalog.moreFailed" class="text-sm text-danger" role="alert">{{ t("catalog.loadMoreFailed") }}</p>
        <BaseButton
          variant="secondary"
          :disabled="catalog.loadingMore"
          :aria-label="catalog.loadingMore ? t('catalog.loadingMore') : undefined"
          data-testid="load-more"
          @click="loadMore"
          >{{ t("catalog.loadMore") }}</BaseButton
        >
      </div>
    </template>
    <div ref="sentinel" class="h-px" aria-hidden="true" />
  </div>
</template>
