<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CategoryChipsProps } from "@/features/catalog/catalog.types";

const props = defineProps<CategoryChipsProps>();
const emit = defineEmits<{ select: [slug: string] }>();
const { t } = useI18n();
</script>

<template>
  <div class="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]" role="group" :aria-label="t('catalog.categories')">
    <button
      type="button"
      :aria-pressed="props.selected === ''"
      class="micro-label min-h-10 shrink-0 rounded-sm border px-4 transition-[transform,background-color,border-color,color] duration-150 active:scale-95 motion-reduce:transition-none"
      :class="props.selected === '' ? 'border-accent bg-accent/15 text-accent' : 'border-edge hover:border-accent hover:text-steel'"
      @click="emit('select', '')"
    >
      {{ t("catalog.allCategories") }}
    </button>
    <button
      v-for="category in props.categories"
      :key="category.id"
      type="button"
      :aria-pressed="props.selected === category.slug"
      class="micro-label min-h-10 shrink-0 rounded-sm border px-4 transition-[transform,background-color,border-color,color] duration-150 active:scale-95 motion-reduce:transition-none"
      :class="props.selected === category.slug ? 'border-accent bg-accent/15 text-accent' : 'border-edge hover:border-accent hover:text-steel'"
      @click="emit('select', category.slug)"
    >
      {{ category.name }}
    </button>
  </div>
</template>
