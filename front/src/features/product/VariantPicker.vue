<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { VariantPickerProps } from "@/features/product/product-view.types";

const props = defineProps<VariantPickerProps>();
const model = defineModel<string | null>({ required: true });
const { t } = useI18n();
</script>

<template>
  <fieldset class="flex flex-col gap-2">
    <legend class="micro-label">{{ t("product.sizeLabel") }}</legend>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="variant in props.variants"
        :key="variant.id"
        type="button"
        :disabled="variant.stock <= 0"
        :aria-pressed="model === variant.id"
        :title="variant.stock <= 0 ? t('product.sizeSoldOut') : undefined"
        class="font-display-tight min-h-12 min-w-14 rounded-sm border px-4 text-xl font-bold transition-colors disabled:cursor-not-allowed disabled:text-muted/50 disabled:line-through"
        :class="model === variant.id ? 'border-accent bg-accent/15 text-accent' : 'border-edge text-steel hover:border-accent'"
        @click="model = variant.id"
      >
        {{ variant.label }}
      </button>
    </div>
  </fieldset>
</template>
