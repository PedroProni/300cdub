<script setup lang="ts">
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import type { SkeletonGridProps } from "@/components/ui/ui.types";

const props = defineProps<SkeletonGridProps>();
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" data-testid="skeleton-grid"><SkeletonCard v-for="n in props.count" :key="n" /></div>
</template>
