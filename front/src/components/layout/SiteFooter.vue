<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSiteStore } from "@/features/site/site.store";
import { instagramProfileUrl } from "@/utils/buy-link";
import { CREDITS_URL } from "@/config/env.constants";

const { t } = useI18n();
const site = useSiteStore();
const instagram = computed(() => (site.settings?.instagramHandle ? instagramProfileUrl(site.settings.instagramHandle) : null));
</script>

<template>
  <footer class="mt-24 border-t border-edge bg-panel">
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-3">
        <p class="flex items-center gap-2 font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-steel">
          <span class="size-2.5 bg-accent" aria-hidden="true" />{{ t("brand.name") }}
        </p>
        <p class="max-w-md text-sm text-muted">{{ t("footer.tagline") }}</p>
      </div>
      <div class="flex flex-col items-start gap-1 sm:items-end">
        <a
          v-if="instagram"
          :href="instagram"
          target="_blank"
          rel="noopener noreferrer"
          class="micro-label text-accent inline-flex min-h-11 items-center border-b border-accent/40 hover:border-accent"
          >{{ t("footer.instagram") }}</a
        >
        <a
          v-if="CREDITS_URL"
          :href="CREDITS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="micro-label inline-flex min-h-11 items-center hover:text-steel"
          data-testid="credits-link"
          >{{ t("footer.credits") }}</a
        >
      </div>
    </div>
  </footer>
</template>
