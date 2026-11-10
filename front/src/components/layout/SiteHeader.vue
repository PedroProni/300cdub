<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-edge bg-ink/85 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
      <RouterLink :to="{ name: ROUTE_NAMES.home }" class="font-display-tight chrome-text text-2xl font-bold">{{ t("brand.name") }}</RouterLink>
      <nav class="flex items-center gap-1 sm:gap-4" :aria-label="t('nav.main')">
        <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="font-display-tight rounded px-3 py-2 text-sm font-semibold text-steel transition-colors hover:text-accent">{{
          t("nav.catalog")
        }}</RouterLink>
        <LanguageSwitcher />
      </nav>
    </div>
  </header>
</template>
