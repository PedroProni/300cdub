import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import { mountWithApp } from "@/test/mount";

const state = vi.hoisted(() => ({ url: "" }));

vi.mock("@/config/env.constants", () => ({
  get CREDITS_URL() {
    return state.url;
  },
}));

beforeEach(() => setActivePinia(createPinia()));

describe("SiteFooter credits link", () => {
  it("hides the link when no credits url is configured", () => {
    state.url = "";
    const { wrapper } = mountWithApp(SiteFooter);
    expect(wrapper.find('[data-testid="credits-link"]').exists()).toBe(false);
  });

  it("shows the link with the localized label and the configured url", () => {
    state.url = "https://example.test/credits";
    const { wrapper } = mountWithApp(SiteFooter);
    const link = wrapper.find('[data-testid="credits-link"]');
    expect(link.attributes("href")).toBe("https://example.test/credits");
    expect(link.text()).toBe("Créditos das imagens");
    expect(link.attributes("rel")).toContain("noopener");
  });
});
