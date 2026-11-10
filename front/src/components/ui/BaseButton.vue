<script setup lang="ts">
import { BUTTON_VARIANT_CLASSES } from "@/components/ui/ui.constants";
import type { BaseButtonProps } from "@/components/ui/ui.types";

const props = withDefaults(defineProps<BaseButtonProps>(), { variant: "primary", type: "button" });
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    class="font-display-tight inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 text-sm font-semibold transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[BUTTON_VARIANT_CLASSES[props.variant], props.block ? 'w-full' : '']"
  >
    <span v-if="props.loading" class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
    <slot />
  </button>
</template>
