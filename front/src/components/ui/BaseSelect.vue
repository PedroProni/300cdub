<script setup lang="ts">
import { useId } from "vue";
import { ChevronDown } from "lucide-vue-next";
import type { BaseSelectProps } from "@/components/ui/ui.types";

const props = defineProps<BaseSelectProps>();
const model = defineModel<string>({ required: true });
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-steel">{{ props.label }}</label>
    <div class="relative">
      <select :id="id" v-model="model" class="h-11 w-full appearance-none rounded-sm border border-edge bg-ink pl-3 pr-9 text-base text-steel">
        <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
    <p v-if="props.error || props.hint" class="text-xs" :class="props.error ? 'text-danger' : 'text-muted'">{{ props.error || props.hint }}</p>
  </div>
</template>
