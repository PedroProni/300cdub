<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import ChangePasswordDialog from "@/features/auth/ChangePasswordDialog.vue";
import { useAuthStore } from "@/features/auth/auth.store";
import { ADMIN_NAV_ITEMS } from "@/components/layout/layout.constants";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();
const passwordOpen = ref(false);

async function signOut(): Promise<void> {
  await auth.logout();
  await router.push({ name: ROUTE_NAMES.login });
}
</script>

<template>
  <header class="border-b border-edge bg-panel">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
      <span class="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-steel">{{ t("admin.title") }}</span>
      <div class="flex flex-wrap items-center gap-2">
        <LanguageSwitcher />
        <BaseButton variant="ghost" @click="passwordOpen = true">{{ t("auth.changePassword.open") }}</BaseButton>
        <BaseButton variant="secondary" @click="signOut">{{ t("auth.logout") }}</BaseButton>
      </div>
    </div>
    <nav class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4" :aria-label="t('nav.admin')">
      <RouterLink
        v-for="item in ADMIN_NAV_ITEMS"
        :key="item.name"
        :to="{ name: item.name }"
        class="micro-label whitespace-nowrap border-b-2 border-transparent px-4 py-4 transition-colors hover:text-steel"
        active-class="!border-accent !text-accent"
      >
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>
  </header>
  <main class="mx-auto max-w-7xl px-4 py-6"><RouterView /></main>
  <ChangePasswordDialog v-if="passwordOpen" @close="passwordOpen = false" />
</template>
