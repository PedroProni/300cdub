<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import { useDebouncedRef } from "@/composables/useDebouncedRef";
import { SORT_OPTIONS } from "@/features/catalog/catalog.constants";
import type { CatalogToolbarProps } from "@/features/catalog/catalog.types";
import type { ProductSort } from "@/types/product.types";

const props = defineProps<CatalogToolbarProps>();
const emit = defineEmits<{ "update:search": [value: string]; "update:sort": [value: ProductSort] }>();
const { t } = useI18n();
const text = ref(props.search);
const debounced = useDebouncedRef(text);
const sortModel = ref<string>(props.sort);

watch(debounced, (value) => emit("update:search", value.trim()));
watch(
  () => props.search,
  (value) => {
    if (value !== text.value.trim()) text.value = value;
  },
);
watch(sortModel, (value) => emit("update:sort", value as ProductSort));
const options = computed(() => SORT_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) })));
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-[1fr_14rem]">
    <div class="flex flex-col gap-1.5">
      <label for="catalog-search" class="text-sm font-medium text-steel">{{ t("catalog.search") }}</label>
      <input
        id="catalog-search"
        v-model="text"
        type="search"
        :placeholder="t('catalog.searchPlaceholder')"
        class="min-h-11 rounded-md border border-edge bg-ink px-3 text-base text-steel placeholder:text-muted/60"
      />
    </div>
    <BaseSelect v-model="sortModel" :label="t('catalog.sortLabel')" :options="options" />
  </div>
</template>
