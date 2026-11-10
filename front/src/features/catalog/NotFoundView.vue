<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useHead } from "@/composables/useHead";
import { ROUTE_NAMES } from "@/router/routes.constants";

const { t } = useI18n();
useHead({ title: () => `${t("notFound.title")} | ${t("brand.name")}` });
</script>

<template>
  <EmptyState :title="t('notFound.title')" :description="t('notFound.description')">
    <RouterLink :to="{ name: ROUTE_NAMES.home }" class="font-display-tight inline-flex min-h-11 items-center rounded-sm bg-accent-fill px-5 text-lg font-bold text-black">{{
      t("notFound.back")
    }}</RouterLink>
  </EmptyState>
</template>
