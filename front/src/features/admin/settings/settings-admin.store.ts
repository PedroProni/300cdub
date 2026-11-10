import { defineStore } from "pinia";
import { ref } from "vue";
import { adminSettingsApi } from "@/api/admin-settings.api";
import type { SiteSettings } from "@/types/settings.types";

export const useSettingsAdminStore = defineStore("settingsAdmin", () => {
  const settings = ref<SiteSettings | null>(null);
  const loading = ref(true);

  async function load(): Promise<void> {
    loading.value = true;
    try {
      settings.value = await adminSettingsApi.get();
    } finally {
      loading.value = false;
    }
  }

  async function save(input: SiteSettings): Promise<void> {
    settings.value = await adminSettingsApi.update(input);
  }

  return { settings, loading, load, save };
});
