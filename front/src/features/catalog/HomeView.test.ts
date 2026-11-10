import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomeView from "@/features/catalog/HomeView.vue";
import { publicApi } from "@/api/public.api";
import { makeProduct, mountWithApp } from "@/test/mount";
import type { ProductPage } from "@/types/product.types";

vi.mock("@/api/public.api", () => ({ publicApi: { product: vi.fn(), settings: vi.fn(), categories: vi.fn(), products: vi.fn() } }));

function featured(ids: string[]): ProductPage {
  return { items: ids.map((id) => makeProduct({ id, slug: id, name: `Produto ${id}`, featured: true })), total: ids.length, page: 1, limit: 9 };
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(publicApi.products).mockReset();
  vi.mocked(publicApi.categories).mockReset().mockResolvedValue([]);
});

describe("HomeView", () => {
  it("renders the stacked hero headline, the marquee and a hero skeleton while loading", () => {
    vi.mocked(publicApi.products).mockReturnValue(new Promise(() => undefined));
    const { wrapper } = mountWithApp(HomeView);
    expect(wrapper.findAll(".hero-line").map((line) => line.text())).toEqual(["Potência", "Velocidade", "Liberdade"]);
    expect(wrapper.find('[data-testid="hero-skeleton"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="skeleton-grid"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="marquee"]').attributes("aria-hidden")).toBe("true");
    expect(wrapper.findAll('[data-testid="marquee"] li').length).toBe(8);
  });

  it("uses the first featured product as hero and makes the next one the large grid card", async () => {
    vi.mocked(publicApi.products).mockResolvedValue(featured(["a", "b", "c"]));
    const { wrapper } = mountWithApp(HomeView);
    await flushPromises();
    const hero = wrapper.find('[data-testid="hero-image"]');
    expect(hero.find("a").attributes("href")).toBe("/produto/a");
    expect(hero.find("img").attributes("loading")).toBe("eager");
    const grid = wrapper.find('[data-testid="featured-grid"]');
    const cells = grid.findAll(":scope > div");
    expect(cells.length).toBe(2);
    expect(cells[0].classes()).toContain("col-span-2");
    expect(cells[1].classes()).not.toContain("col-span-2");
    expect(grid.find("a[href='/produto/a']").exists()).toBe(false);
    expect(grid.find("a[href='/produto/b']").exists()).toBe(true);
  });

  it("shows the hero backdrop and a mobile row with the next two products, hidden from the mobile grid", async () => {
    vi.mocked(publicApi.products).mockResolvedValue(featured(["a", "b", "c", "d"]));
    const { wrapper } = mountWithApp(HomeView);
    await flushPromises();
    expect(wrapper.find('[data-testid="hero-backdrop"] img').attributes("alt")).toBe("");
    const picks = wrapper.findAll('[data-testid="hero-picks"] li');
    expect(picks.map((item) => item.find("a").attributes("href"))).toEqual(["/produto/b", "/produto/c"]);
    const cells = wrapper.find('[data-testid="featured-grid"]').findAll(":scope > div");
    expect(cells.map((cell) => cell.classes().includes("max-lg:hidden"))).toEqual([true, true, false]);
  });

  it("falls back to the static hero photo and the empty state without featured products", async () => {
    vi.mocked(publicApi.products).mockResolvedValue(featured([]));
    const { wrapper } = mountWithApp(HomeView);
    await flushPromises();
    expect(wrapper.find('[data-testid="hero-image"] img').attributes("alt")).toBe("");
    expect(wrapper.find('[data-testid="featured-grid"]').exists()).toBe(false);
  });
});
