<script setup lang="ts">
import type { SkeletonFormProps } from "@/components/ui/ui.types";

const props = defineProps<SkeletonFormProps>();
</script>

<template>
  <div class="metal-card flex flex-col gap-5 rounded-xl p-5" aria-busy="true" data-testid="skeleton-form">
    <div v-for="n in props.fields" :key="n" class="flex flex-col gap-2" aria-hidden="true">
      <div class="skeleton h-4 w-24 rounded" />
      <div class="skeleton h-11 w-full rounded-md" />
    </div>
    <div class="skeleton h-11 w-32 rounded-md" aria-hidden="true" />
  </div>
</template>
