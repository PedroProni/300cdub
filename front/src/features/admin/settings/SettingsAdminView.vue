<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import SkeletonForm from "@/components/ui/SkeletonForm.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import { useSettingsAdminStore } from "@/features/admin/settings/settings-admin.store";
import { MIN_WHATSAPP_DIGITS } from "@/features/admin/settings/settings-admin.constants";
import { useApiError } from "@/composables/useApiError";
import { useHead } from "@/composables/useHead";
import { useToast } from "@/composables/useToast";
import { cleanHandle, fillTemplate, onlyDigits } from "@/utils/buy-link";
import type { SiteSettings } from "@/types/settings.types";

const { t } = useI18n();
const store = useSettingsAdminStore();
const toast = useToast();
const { messageFor } = useApiError();
const form = ref<SiteSettings>({ instagramHandle: "", whatsappNumber: "", messageTemplate: "" });
const saving = ref(false);
const submitted = ref(false);

useHead({ title: () => `${t("nav.settings")} | ${t("brand.name")}` });

const whatsappError = computed(() => (submitted.value && onlyDigits(form.value.whatsappNumber).length < MIN_WHATSAPP_DIGITS ? t("admin.settings.whatsappError") : ""));
const handleError = computed(() => (submitted.value && cleanHandle(form.value.instagramHandle) === "" ? t("admin.settings.handleError") : ""));
const preview = computed(() => fillTemplate(form.value.messageTemplate, t("admin.settings.previewProduct"), t("admin.settings.previewSize")));

onMounted(async () => {
  try {
    await store.load();
    if (store.settings) form.value = { ...store.settings };
  } catch (error) {
    toast.error(messageFor(error));
  }
});

async function save(): Promise<void> {
  submitted.value = true;
  if (whatsappError.value || handleError.value) return;
  saving.value = true;
  try {
    await store.save({
      instagramHandle: cleanHandle(form.value.instagramHandle),
      whatsappNumber: onlyDigits(form.value.whatsappNumber),
      messageTemplate: form.value.messageTemplate.trim(),
    });
    if (store.settings) form.value = { ...store.settings };
    toast.success(t("admin.settings.saved"));
  } catch (error) {
    toast.error(messageFor(error));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h1 class="font-display-tight text-2xl font-bold text-steel">{{ t("nav.settings") }}</h1>
    <SkeletonForm v-if="store.loading" :fields="4" />
    <form v-else class="metal-card flex flex-col gap-4 rounded-xl p-4 sm:p-6" novalidate @submit.prevent="save">
      <BaseInput v-model="form.instagramHandle" :label="t('admin.settings.instagram')" :hint="t('admin.settings.instagramHint')" :error="handleError" autocomplete="off" />
      <BaseInput
        v-model="form.whatsappNumber"
        type="tel"
        inputmode="tel"
        :label="t('admin.settings.whatsapp')"
        :hint="t('admin.settings.whatsappHint')"
        :error="whatsappError"
        autocomplete="off"
      />
      <BaseTextarea v-model="form.messageTemplate" :label="t('admin.settings.template')" :hint="t('admin.settings.templateHint')" />
      <div class="rounded-md border border-edge bg-ink p-3">
        <p class="text-xs font-semibold text-muted">{{ t("admin.settings.preview") }}</p>
        <p class="mt-1 whitespace-pre-line text-sm text-steel" data-testid="template-preview">{{ preview }}</p>
      </div>
      <div class="flex justify-end">
        <BaseButton type="submit" :loading="saving">{{ t("common.save") }}</BaseButton>
      </div>
    </form>
  </div>
</template>
