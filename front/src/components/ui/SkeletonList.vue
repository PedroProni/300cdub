<script setup lang="ts">
import type { SkeletonListProps } from "@/components/ui/ui.types";

const props = defineProps<SkeletonListProps>();
</script>

<template>
  <div class="space-y-3" aria-busy="true" data-testid="skeleton-list">
    <div v-for="n in props.count" :key="n" class="metal-card flex h-20 items-center gap-3 rounded-sm p-3" aria-hidden="true">
      <div class="skeleton size-14 shrink-0 rounded-sm" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="skeleton h-4 w-1/2 rounded" />
        <div class="skeleton h-4 w-1/4 rounded" />
      </div>
      <div class="skeleton h-9 w-20 rounded-sm" />
    </div>
  </div>
</template>
