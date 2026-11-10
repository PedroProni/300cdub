<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSiteStore } from "@/features/site/site.store";
import { instagramProfileUrl } from "@/utils/buy-link";

const { t } = useI18n();
const site = useSiteStore();
const instagram = computed(() => (site.settings?.instagramHandle ? instagramProfileUrl(site.settings.instagramHandle) : null));
</script>

<template>
  <footer class="mt-16 border-t border-edge bg-panel/60">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row">
      <p>{{ t("footer.tagline") }}</p>
      <a v-if="instagram" :href="instagram" target="_blank" rel="noopener noreferrer" class="font-semibold text-accent hover:underline">{{ t("footer.instagram") }}</a>
    </div>
  </footer>
</template>
