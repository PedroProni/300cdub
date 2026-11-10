<script setup lang="ts">
import type { SkeletonCardProps } from "@/components/ui/ui.types";

const props = withDefaults(defineProps<SkeletonCardProps>(), { featured: false });
</script>

<template>
  <div class="flex h-full flex-col border border-edge bg-panel" aria-hidden="true" data-testid="skeleton-card">
    <div class="skeleton w-full" :class="props.featured ? 'aspect-[16/11] lg:aspect-auto lg:min-h-0 lg:flex-1' : 'aspect-[4/5]'" />
    <div class="flex min-h-28 flex-col justify-between gap-2 border-t border-edge p-3">
      <div class="skeleton h-6 w-3/4" />
      <div class="skeleton h-5 w-1/3" />
    </div>
  </div>
</template>
