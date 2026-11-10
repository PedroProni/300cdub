<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import heroImage from "@/assets/images/main-img.jpeg";
import heroImage540 from "@/assets/images/main-img-540.webp";
import heroImage1080 from "@/assets/images/main-img-1080.webp";
import EmptyState from "@/components/ui/EmptyState.vue";
import SkeletonGrid from "@/components/ui/SkeletonGrid.vue";
import CategoryChips from "@/features/catalog/CategoryChips.vue";
import ProductCard from "@/features/catalog/ProductCard.vue";
import { useCatalogStore } from "@/features/catalog/catalog.store";
import { EAGER_CARD_COUNT, HOME_FEATURED_LIMIT } from "@/features/catalog/catalog.constants";
import { useHead } from "@/composables/useHead";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
const catalog = useCatalogStore();
const router = useRouter();
const loaded = ref(false);

useHead({ title: () => t("home.metaTitle"), description: () => t("home.metaDescription") });

onMounted(async () => {
  await Promise.all([catalog.loadCategories(), catalog.loadFeatured(HOME_FEATURED_LIMIT)]);
  loaded.value = true;
});

function openCategory(slug: string): void {
  router.push({ name: ROUTE_NAMES.catalog, query: slug ? { category: slug } : {} });
}
</script>

<template>
  <section class="relative -mx-4 -mt-6 flex min-h-[70vh] items-center justify-center overflow-hidden px-4 text-center">
    <img
      :src="heroImage"
      :srcset="`${heroImage540} 540w, ${heroImage1080} 1080w`"
      sizes="100vw"
      width="1080"
      height="1440"
      alt=""
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 size-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-black to-black/60" aria-hidden="true" />
    <div class="relative flex max-w-2xl flex-col items-center gap-4 py-16">
      <span class="rounded-lg bg-accent/70 px-3 py-1 text-sm font-semibold text-black">{{ t("home.badge") }}</span>
      <h1 class="chrome-text text-6xl font-bold uppercase sm:text-7xl">{{ t("brand.name") }}</h1>
      <p class="text-lg text-steel/80">{{ t("home.subtitle") }}</p>
      <RouterLink
        :to="{ name: ROUTE_NAMES.catalog }"
        class="font-display-tight mt-2 inline-flex min-h-12 items-center press rounded-md bg-accent px-8 text-sm font-bold text-black hover:bg-accent-hot"
        >{{ t("home.cta") }}</RouterLink
      >
    </div>
  </section>

  <section class="mt-10 flex min-h-11 flex-col gap-4" :aria-label="t('catalog.categories')">
    <CategoryChips v-if="catalog.categories.length > 0" :categories="catalog.categories" selected="" @select="openCategory" />
  </section>

  <section class="mt-8">
    <h2 class="font-display-tight mb-4 text-2xl font-bold text-steel">{{ t("home.featuredTitle") }}</h2>
    <SkeletonGrid v-if="!loaded" :count="HOME_FEATURED_LIMIT" />
    <div v-else-if="catalog.featured.length > 0" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <ProductCard v-for="(product, position) in catalog.featured" :key="product.id" :product="product" :eager="position < EAGER_CARD_COUNT" />
    </div>
    <EmptyState v-else :title="t('home.featuredEmptyTitle')" :description="t('home.featuredEmptyDescription')" />
  </section>
</template>
