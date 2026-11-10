<script setup lang="ts">
import type { EmptyStateProps } from "@/components/ui/ui.types";

const props = defineProps<EmptyStateProps>();
</script>

<template>
  <div class="metal-card flex flex-col items-center gap-3 rounded-xl px-6 py-14 text-center" role="status">
    <h2 class="font-display-tight text-xl text-steel">{{ props.title }}</h2>
    <p v-if="props.description" class="max-w-md text-sm text-muted">{{ props.description }}</p>
    <div class="mt-2 flex flex-wrap justify-center gap-3"><slot /></div>
  </div>
</template>
