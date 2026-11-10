<script setup lang="ts">
import { RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import SiteHeader from "@/components/layout/SiteHeader.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import { useSiteStore } from "@/features/site/site.store";

const { t } = useI18n();
const site = useSiteStore();
site.load();
</script>

<template>
  <a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-black">{{
    t("nav.skip")
  }}</a>
  <SiteHeader />
  <main id="content" class="mx-auto min-h-[60vh] max-w-6xl px-4 pt-6">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in"><component :is="Component" :key="route.path" /></Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>
