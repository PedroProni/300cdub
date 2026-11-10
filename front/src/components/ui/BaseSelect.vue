<script setup lang="ts">
import { useId } from "vue";
import type { BaseSelectProps } from "@/components/ui/ui.types";

const props = defineProps<BaseSelectProps>();
const model = defineModel<string>({ required: true });
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-steel">{{ props.label }}</label>
    <select :id="id" v-model="model" class="min-h-11 rounded-md border border-edge bg-ink px-3 text-base text-steel">
      <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <p v-if="props.error || props.hint" class="text-xs" :class="props.error ? 'text-danger' : 'text-muted'">{{ props.error || props.hint }}</p>
  </div>
</template>
