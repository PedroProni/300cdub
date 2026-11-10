import { request } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints.constants";
import type { SiteSettings } from "@/types/settings.types";

export const adminSettingsApi = {
  get: () => request<SiteSettings>(ENDPOINTS.adminSettings),
  update: (input: SiteSettings) => request<SiteSettings>(ENDPOINTS.adminSettings, { method: "PUT", body: input }),
};
