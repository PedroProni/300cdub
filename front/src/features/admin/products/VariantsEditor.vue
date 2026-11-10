<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Plus, Trash2 } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { VariantsEditorProps } from "@/features/admin/products/products-admin.types";

const props = defineProps<VariantsEditorProps>();
const model = defineModel<{ label: string; stock: number }[]>({ required: true });
const { t } = useI18n();

function add(): void {
  model.value = [...model.value, { label: "", stock: 0 }];
}

function removeAt(index: number): void {
  model.value = model.value.filter((_, position) => position !== index);
}
</script>

<template>
  <fieldset class="flex flex-col gap-3">
    <legend class="micro-label">{{ t("admin.products.variants.title") }}</legend>
    <p class="text-xs text-muted">{{ t("admin.products.variants.help") }}</p>
    <div v-for="(variant, index) in model" :key="index" class="grid grid-cols-[1fr_6rem_auto] items-end gap-2">
      <div class="flex flex-col gap-1">
        <label :for="`variant-label-${index}`" class="text-xs text-muted">{{ t("admin.products.variants.label") }}</label>
        <input :id="`variant-label-${index}`" v-model="variant.label" type="text" class="min-h-11 rounded-sm border border-edge bg-ink px-3 text-base text-steel" />
      </div>
      <div class="flex flex-col gap-1">
        <label :for="`variant-stock-${index}`" class="text-xs text-muted">{{ t("admin.products.variants.stock") }}</label>
        <input
          :id="`variant-stock-${index}`"
          v-model.number="variant.stock"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          class="min-h-11 rounded-sm border border-edge bg-ink px-3 text-base text-steel"
        />
      </div>
      <button
        type="button"
        class="flex size-11 items-center justify-center rounded-sm text-danger hover:bg-danger/15"
        :aria-label="t('admin.products.variants.remove')"
        @click="removeAt(index)"
      >
        <Trash2 class="size-5" aria-hidden="true" />
      </button>
    </div>
    <p v-if="props.error" role="alert" class="text-xs text-danger">{{ props.error }}</p>
    <div>
      <BaseButton variant="secondary" @click="add"><Plus class="size-4" aria-hidden="true" />{{ t("admin.products.variants.add") }}</BaseButton>
    </div>
  </fieldset>
</template>
