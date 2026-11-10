<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import { TOAST_CLASSES } from "@/components/ui/toast.constants";

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      role="status"
      class="pointer-events-auto w-full max-w-sm rounded-md border px-4 py-3 text-sm shadow-lg"
      :class="TOAST_CLASSES[toast.kind]"
      @click="dismiss(toast.id)"
    >
      {{ toast.message }}
    </div>
  </div>
</template>
