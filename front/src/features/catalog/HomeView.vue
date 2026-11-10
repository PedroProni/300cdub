<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import PriceTag from "@/components/ui/PriceTag.vue";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import SkeletonGrid from "@/components/ui/SkeletonGrid.vue";
import { FEATURED_CELL_CLASS, PRODUCT_GRID_CLASS } from "@/components/ui/ui.constants";
import CategoryChips from "@/features/catalog/CategoryChips.vue";
import HeroBackdrop from "@/features/catalog/HeroBackdrop.vue";
import HeroImage from "@/features/catalog/HeroImage.vue";
import ProductCard from "@/features/catalog/ProductCard.vue";
import { useCatalogStore } from "@/features/catalog/catalog.store";
import { EAGER_CARD_COUNT, HOME_FEATURED_LIMIT } from "@/features/catalog/catalog.constants";
import { HERO_LINE_KEYS, HERO_PICK_COUNT, HOME_MARQUEE_KEYS, MARQUEE_COPIES } from "@/features/catalog/home.constants";
import { useHead } from "@/composables/useHead";
import { vReveal } from "@/directives/reveal.directive";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
const catalog = useCatalogStore();
const router = useRouter();
const loaded = ref(false);
const heroProduct = computed(() => catalog.featured[0] ?? null);
const gridProducts = computed(() => catalog.featured.slice(1));
const heroPicks = computed(() => gridProducts.value.slice(0, HERO_PICK_COUNT));

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
  <div class="relative left-1/2 -mt-6 w-screen -translate-x-1/2 overflow-hidden" data-testid="hero">
    <HeroBackdrop />
    <div class="relative mx-auto max-w-7xl px-4">
    <section class="grid gap-8 pb-8 pt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-16 lg:pt-14">
      <div class="flex flex-col gap-6 lg:col-span-7">
        <p class="micro-label hero-fade flex items-center gap-2" style="--line: 0"><span class="size-2 bg-accent" aria-hidden="true" />{{ t("home.badge") }}</p>
        <h1 class="hero-title text-[3.75rem] text-steel sm:text-[8rem] lg:text-[9.5rem]">
          <span class="sr-only">{{ t("brand.name") }}</span>
          <span v-for="(key, index) in HERO_LINE_KEYS" :key="key" class="hero-line" aria-hidden="true"
            ><span :style="{ '--line': index + 1 }" :class="index === HERO_LINE_KEYS.length - 1 ? 'text-accent' : ''">{{ t(key) }}</span></span
          >
        </h1>
        <p class="hero-fade max-w-md text-sm text-muted" style="--line: 4">{{ t("home.subtitle") }}</p>
        <div class="hero-fade flex flex-wrap gap-3" style="--line: 5">
          <RouterLink
            :to="{ name: ROUTE_NAMES.catalog }"
            class="font-display-tight inline-flex min-h-12 items-center rounded-sm border border-accent-fill bg-accent-fill px-8 text-lg font-bold text-black transition-colors hover:border-accent hover:bg-accent"
            >{{ t("home.cta") }}</RouterLink
          >
          <a
            href="#destaques"
            class="font-display-tight inline-flex min-h-12 items-center rounded-sm border border-edge px-8 text-lg font-bold text-steel transition-colors hover:border-accent hover:text-accent"
            >{{ t("home.ctaSecondary") }}</a
          >
        </div>
      </div>
      <div class="hero-fade lg:col-span-5" style="--line: 3"><HeroImage :product="heroProduct" :loaded="loaded" /></div>
      </section>
      <ul v-if="heroPicks.length > 0" class="grid grid-cols-2 gap-3 pb-8 lg:hidden" data-testid="hero-picks">
        <li v-for="product in heroPicks" :key="product.id">
          <RouterLink :to="{ name: ROUTE_NAMES.product, params: { slug: product.slug } }" class="group flex flex-col border border-edge bg-panel/90">
            <span class="relative block aspect-square overflow-hidden bg-raised">
              <ResponsiveImage v-if="product.images[0]" :urls="product.images[0].urls" :alt="product.name" sizes="50vw" img-class="card-photo" />
            </span>
            <span class="flex flex-col gap-1 border-t border-edge p-2">
              <span class="font-display-tight line-clamp-1 text-lg font-semibold leading-none text-steel">{{ product.name }}</span>
              <PriceTag :price="product.price" :promo-price="product.promoPrice" />
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>

  <div class="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-edge bg-panel py-3" aria-hidden="true" data-testid="marquee">
    <div class="marquee-track">
      <ul v-for="copy in MARQUEE_COPIES" :key="copy" class="flex shrink-0 items-center">
        <li v-for="key in HOME_MARQUEE_KEYS" :key="key" class="font-display-tight flex items-center gap-6 pr-6 text-4xl font-bold leading-none text-steel">
          {{ t(key) }}<span class="size-2.5 shrink-0 bg-accent" />
        </li>
      </ul>
    </div>
  </div>

  <section id="destaques" class="mt-14 scroll-mt-20" :aria-label="t('home.featuredTitle')">
    <div class="mb-6 flex items-end justify-between gap-4">
      <h2 class="font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-steel">{{ t("home.featuredTitle") }}</h2>
      <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="micro-label text-accent inline-flex min-h-11 items-center border-b border-accent/40 hover:border-accent">{{ t("home.viewAll") }}</RouterLink>
    </div>
    <div class="mb-6 min-h-10">
      <CategoryChips v-if="catalog.categories.length > 0" :categories="catalog.categories" selected="" @select="openCategory" />
    </div>
    <SkeletonGrid v-if="!loaded" :count="HOME_FEATURED_LIMIT" featured />
    <div v-else-if="catalog.featured.length > 0" :class="PRODUCT_GRID_CLASS" data-testid="featured-grid">
      <div v-if="heroProduct && gridProducts.length === 0" class="col-span-2 lg:col-span-1"><ProductCard :product="heroProduct" eager /></div>
      <div v-for="(product, position) in gridProducts" :key="product.id" v-reveal="position" :class="[position === 0 ? FEATURED_CELL_CLASS : '', position < HERO_PICK_COUNT ? 'max-lg:hidden' : '']">
        <ProductCard :product="product" :featured="position === 0" :eager="position < EAGER_CARD_COUNT" />
      </div>
      <RouterLink
        v-if="gridProducts.length > 0"
        v-reveal="gridProducts.length"
        :to="{ name: ROUTE_NAMES.catalog }"
        class="group flex min-h-48 flex-col justify-between border border-accent-fill bg-accent-fill p-4 text-black transition-colors hover:border-accent hover:bg-accent"
      >
        <span class="micro-label text-black/70">{{ t("brand.name") }}</span>
        <span class="flex items-end justify-between gap-3">
          <span class="font-display-tight text-3xl font-extrabold leading-[0.95]">{{ t("home.viewAllTile") }}</span>
          <svg class="size-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </span>
      </RouterLink>
    </div>
    <EmptyState v-else :title="t('home.featuredEmptyTitle')" :description="t('home.featuredEmptyDescription')" />
  </section>
</template>
