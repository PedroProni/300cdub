<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CategoryChipsProps } from "@/features/catalog/catalog.types";

const props = defineProps<CategoryChipsProps>();
const emit = defineEmits<{ select: [slug: string] }>();
const { t } = useI18n();
</script>

<template>
  <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" :aria-label="t('catalog.categories')">
    <button
      type="button"
      :aria-pressed="props.selected === ''"
      class="font-display-tight min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 active:scale-95 motion-reduce:transition-none"
      :class="props.selected === '' ? 'border-accent bg-accent text-black' : 'border-edge text-steel hover:border-accent'"
      @click="emit('select', '')"
    >
      {{ t("catalog.allCategories") }}
    </button>
    <button
      v-for="category in props.categories"
      :key="category.id"
      type="button"
      :aria-pressed="props.selected === category.slug"
      class="font-display-tight min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 active:scale-95 motion-reduce:transition-none"
      :class="props.selected === category.slug ? 'border-accent bg-accent text-black' : 'border-edge text-steel hover:border-accent'"
      @click="emit('select', category.slug)"
    >
      {{ category.name }}
    </button>
  </div>
</template>
