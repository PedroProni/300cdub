<script setup lang="ts">
import { useId } from "vue";
import type { BaseFieldProps } from "@/components/ui/ui.types";

const props = defineProps<BaseFieldProps>();
const model = defineModel<string>({ required: true });
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-steel">{{ props.label }}</label>
    <textarea
      :id="id"
      v-model="model"
      rows="5"
      :aria-invalid="props.error ? true : undefined"
      class="rounded-sm border border-edge bg-ink px-3 py-2 text-base text-steel"
      :class="props.error ? 'border-danger' : ''"
    />
    <p v-if="props.error || props.hint" class="text-xs" :class="props.error ? 'text-danger' : 'text-muted'">{{ props.error || props.hint }}</p>
  </div>
</template>
