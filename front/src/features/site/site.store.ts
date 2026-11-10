import { defineStore } from "pinia";
import { ref } from "vue";
import { publicApi } from "@/api/public.api";
import type { SiteSettings } from "@/types/settings.types";

export const useSiteStore = defineStore("site", () => {
  const settings = ref<SiteSettings | null>(null);
  let pending: Promise<void> | null = null;

  async function load(): Promise<void> {
    if (settings.value) return;
    pending ??= publicApi
      .settings()
      .then((value) => {
        settings.value = value;
      })
      .catch(() => undefined)
      .finally(() => {
        pending = null;
      });
    await pending;
  }

  return { settings, load };
});
