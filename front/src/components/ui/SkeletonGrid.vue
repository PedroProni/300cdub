<script setup lang="ts">
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { FEATURED_CELL_CLASS, PRODUCT_GRID_CLASS } from "@/components/ui/ui.constants";
import type { SkeletonGridProps } from "@/components/ui/ui.types";

const props = withDefaults(defineProps<SkeletonGridProps>(), { featured: false });
</script>

<template>
  <div :class="PRODUCT_GRID_CLASS" aria-busy="true" data-testid="skeleton-grid">
    <div v-for="n in props.count" :key="n" :class="props.featured && n === 1 ? FEATURED_CELL_CLASS : ''"><SkeletonCard :featured="props.featured && n === 1" /></div>
  </div>
</template>
