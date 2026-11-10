<script setup lang="ts">
import type { BaseSwitchProps } from "@/components/ui/ui.types";

const props = defineProps<BaseSwitchProps>();
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <button type="button" role="switch" :aria-checked="model" :aria-label="props.label" class="inline-flex min-h-11 items-center gap-3" @click="model = !model">
    <span class="relative h-6 w-11 rounded-full border border-edge transition-colors" :class="model ? 'bg-accent' : 'bg-raised'">
      <span class="absolute top-0.5 size-5 rounded-full bg-steel transition-all" :class="model ? 'left-5' : 'left-0.5'" />
    </span>
    <span class="whitespace-nowrap text-sm text-steel">{{ props.label }}</span>
  </button>
</template>
