<script setup lang="ts">
import { useId } from "vue";
import type { BaseInputProps } from "@/components/ui/ui.types";

const props = withDefaults(defineProps<BaseInputProps>(), { type: "text" });
const model = defineModel<string | number | null>({ required: true, set: (value) => (props.type === "number" && value === "" ? null : value) });
const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-steel">{{ props.label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :inputmode="props.inputmode"
      :min="props.min"
      :step="props.step"
      :required="props.required"
      :aria-invalid="props.error ? true : undefined"
      :aria-describedby="props.error || props.hint ? `${id}-note` : undefined"
      class="min-h-11 rounded-md border border-edge bg-ink px-3 text-base text-steel placeholder:text-muted/60"
      :class="props.error ? 'border-danger' : ''"
    />
    <p v-if="props.error || props.hint" :id="`${id}-note`" class="text-xs" :class="props.error ? 'text-danger' : 'text-muted'">{{ props.error || props.hint }}</p>
  </div>
</template>
