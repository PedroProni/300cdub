<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useAuthStore } from "@/features/auth/auth.store";
import { useApiError } from "@/composables/useApiError";
import { useToast } from "@/composables/useToast";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/auth.constants";

const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const auth = useAuthStore();
const toast = useToast();
const { messageFor } = useApiError();
const current = ref("");
const next = ref("");
const confirmation = ref("");
const loading = ref(false);
const errorMessage = ref("");

const nextError = computed(() => (next.value && next.value.length < MIN_PASSWORD_LENGTH ? t("auth.changePassword.tooShort", { min: MIN_PASSWORD_LENGTH }) : ""));
const confirmError = computed(() => (confirmation.value && confirmation.value !== next.value ? t("auth.changePassword.mismatch") : ""));
const canSubmit = computed(() => current.value !== "" && next.value.length >= MIN_PASSWORD_LENGTH && confirmation.value === next.value);

async function submit(): Promise<void> {
  errorMessage.value = "";
  loading.value = true;
  try {
    await auth.changePassword({ currentPassword: current.value, newPassword: next.value });
    toast.success(t("auth.changePassword.success"));
    emit("close");
  } catch (error) {
    errorMessage.value = messageFor(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center" @keydown.esc="emit('close')" @click.self="emit('close')">
    <form
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-title"
      class="metal-card flex w-full max-w-md flex-col gap-4 rounded-xl p-6"
      novalidate
      @submit.prevent="submit"
    >
      <h2 id="password-title" class="font-display-tight text-xl text-steel">{{ t("auth.changePassword.title") }}</h2>
      <BaseInput v-model="current" type="password" autocomplete="current-password" :label="t('auth.changePassword.current')" />
      <BaseInput v-model="next" type="password" autocomplete="new-password" :label="t('auth.changePassword.new')" :error="nextError" />
      <BaseInput v-model="confirmation" type="password" autocomplete="new-password" :label="t('auth.changePassword.confirm')" :error="confirmError" />
      <p v-if="errorMessage" role="alert" class="rounded border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">{{ errorMessage }}</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">{{ t("common.cancel") }}</BaseButton>
        <BaseButton type="submit" :loading="loading" :disabled="!canSubmit">{{ t("common.save") }}</BaseButton>
      </div>
    </form>
  </div>
</template>
