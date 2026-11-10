<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
</script>

<template>
  <header class="sticky top-0 z-30 h-14 border-b border-edge bg-ink/90 backdrop-blur">
    <div class="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4">
      <RouterLink :to="{ name: ROUTE_NAMES.home }" class="group flex items-center gap-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-steel">
        <span class="size-2.5 bg-accent transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none" aria-hidden="true" />{{ t("brand.name") }}
      </RouterLink>
      <nav class="flex items-center gap-2 sm:gap-5" :aria-label="t('nav.main')">
        <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="micro-label text-steel px-2 py-3 transition-colors hover:text-accent">{{ t("nav.catalog") }}</RouterLink>
        <LanguageSwitcher />
      </nav>
    </div>
  </header>
</template>
