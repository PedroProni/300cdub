<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useConfirm } from "@/composables/useConfirm";

const { t } = useI18n();
const { state, accept, cancel } = useConfirm();
const confirmButton = ref<InstanceType<typeof BaseButton> | null>(null);

watch(
  () => state.open,
  async (open) => {
    if (!open) return;
    await nextTick();
    (confirmButton.value?.$el as HTMLElement | undefined)?.focus();
  },
);
</script>

<template>
  <div v-if="state.open" class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" @keydown.esc="cancel" @click.self="cancel">
    <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" class="metal-card w-full max-w-md rounded-xl p-6">
      <h2 id="confirm-title" class="font-display-tight text-xl text-steel">{{ state.title }}</h2>
      <p id="confirm-message" class="mt-2 text-sm text-muted">{{ state.message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <BaseButton variant="ghost" @click="cancel">{{ t("common.cancel") }}</BaseButton>
        <BaseButton ref="confirmButton" variant="danger" data-testid="confirm-accept" @click="accept">{{ state.confirmLabel }}</BaseButton>
      </div>
    </div>
  </div>
</template>
