<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import PriceTag from "@/components/ui/PriceTag.vue";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import { ROUTE_NAMES } from "@/router/routes.constants";
import { HERO_IMAGE_SIZES } from "@/features/catalog/home.constants";
import type { HeroImageProps } from "@/features/catalog/catalog.types";

const props = defineProps<HeroImageProps>();
const { t } = useI18n();
const cover = computed(() => props.product?.images[0]?.urls ?? null);
</script>

<template>
  <div class="relative aspect-[4/5] w-full overflow-hidden border border-edge bg-raised" data-testid="hero-image">
    <div v-if="!props.loaded" class="skeleton absolute inset-0" aria-hidden="true" data-testid="hero-skeleton" />
    <RouterLink v-else-if="props.product && cover" :to="{ name: ROUTE_NAMES.product, params: { slug: props.product.slug } }" class="group absolute inset-0 block">
      <ResponsiveImage
        :urls="cover"
        :alt="props.product.name"
        :sizes="HERO_IMAGE_SIZES"
        eager
        priority
        fallback-src="large"
        img-class="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-16">
        <span class="micro-label text-accent">{{ t("home.hero.pick") }}</span>
        <span class="font-display-tight line-clamp-2 text-2xl font-bold leading-none text-steel">{{ props.product.name }}</span>
        <PriceTag :price="props.product.price" :promo-price="props.product.promoPrice" />
      </div>
    </RouterLink>
  </div>
</template>
