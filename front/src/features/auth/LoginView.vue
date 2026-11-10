<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import { useAuthStore } from "@/features/auth/auth.store";
import { useApiError } from "@/composables/useApiError";
import { useHead } from "@/composables/useHead";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const { messageFor } = useApiError();
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

useHead({ title: () => `${t("auth.login.title")} | ${t("brand.name")}` });

async function submit(): Promise<void> {
  errorMessage.value = "";
  loading.value = true;
  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    const redirect = typeof route.query.redirect === "string" && route.query.redirect.startsWith("/admin") ? route.query.redirect : null;
    await router.replace(redirect ?? { name: ROUTE_NAMES.adminProducts });
  } catch (error) {
    errorMessage.value = messageFor(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4 py-10">
    <div class="flex items-center justify-between">
      <h1 class="font-display-tight chrome-text text-3xl font-bold">{{ t("brand.name") }}</h1>
      <LanguageSwitcher />
    </div>
    <form class="metal-card flex flex-col gap-4 rounded-xl p-6" novalidate @submit.prevent="submit">
      <h2 class="font-display-tight text-lg text-steel">{{ t("auth.login.title") }}</h2>
      <BaseInput v-model="email" type="email" autocomplete="username" inputmode="email" :label="t('auth.login.email')" required />
      <BaseInput v-model="password" type="password" autocomplete="current-password" :label="t('auth.login.password')" required />
      <p v-if="errorMessage" role="alert" class="rounded border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">{{ errorMessage }}</p>
      <BaseButton type="submit" block :loading="loading" :disabled="!email || !password">{{ t("auth.login.submit") }}</BaseButton>
    </form>
  </div>
</template>
