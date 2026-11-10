import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CatalogView from "@/features/catalog/CatalogView.vue";
import { publicApi } from "@/api/public.api";
import { makeProduct, mountWithApp } from "@/test/mount";
import type { ProductPage } from "@/types/product.types";

vi.mock("@/api/public.api", () => ({ publicApi: { product: vi.fn(), settings: vi.fn(), categories: vi.fn(), products: vi.fn() } }));

function page(ids: string[], total: number, number: number): ProductPage {
  return { items: ids.map((id) => makeProduct({ id, slug: id, name: `Produto ${id}` })), total, page: number, limit: 2 };
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(publicApi.products).mockReset();
  vi.mocked(publicApi.categories).mockReset().mockResolvedValue([]);
});

describe("CatalogView", () => {
  it("shows the content-shaped skeleton grid first and swaps it for the products", async () => {
    let release: (value: ProductPage) => void = () => undefined;
    vi.mocked(publicApi.products).mockReturnValue(new Promise((resolve) => (release = resolve)));
    const { wrapper } = mountWithApp(CatalogView);
    expect(wrapper.find('[data-testid="skeleton-grid"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="skeleton-card"]').length).toBe(12);
    expect(wrapper.find("a[href^='/produto/']").exists()).toBe(false);
    release(page(["a", "b"], 2, 1));
    await flushPromises();
    expect(wrapper.find('[data-testid="skeleton-grid"]').exists()).toBe(false);
    expect(wrapper.findAll("a[href^='/produto/']").length).toBe(2);
  });

  it("marks only the first row eager with high priority and the rest lazy", async () => {
    const ids = ["a", "b", "c", "d", "e", "f"];
    vi.mocked(publicApi.products).mockResolvedValue(page(ids, 6, 1));
    const { wrapper } = mountWithApp(CatalogView);
    await flushPromises();
    const images = wrapper.findAll("img");
    expect(images.map((img) => img.attributes("loading"))).toEqual(["eager", "eager", "eager", "eager", "lazy", "lazy"]);
    expect(images.map((img) => img.attributes("fetchpriority"))).toEqual(["high", "high", "high", "high", "auto", "auto"]);
  });

  it("appends the next page with the load more button and hides it at the end", async () => {
    vi.mocked(publicApi.products)
      .mockResolvedValueOnce(page(["a", "b"], 3, 1))
      .mockResolvedValueOnce(page(["c"], 3, 2));
    const { wrapper } = mountWithApp(CatalogView);
    await flushPromises();
    expect(wrapper.findAll("a[href^='/produto/']").length).toBe(2);
    await wrapper.get('[data-testid="load-more"]').trigger("click");
    await flushPromises();
    expect(vi.mocked(publicApi.products).mock.calls[1]?.[0]).toMatchObject({ page: 2 });
    expect(wrapper.findAll("a[href^='/produto/']").length).toBe(3);
    expect(wrapper.find('[data-testid="load-more"]').exists()).toBe(false);
  });

  it("keeps the products and offers a retry when loading more fails", async () => {
    vi.mocked(publicApi.products)
      .mockResolvedValueOnce(page(["a", "b"], 3, 1))
      .mockRejectedValueOnce(new Error("x"))
      .mockResolvedValueOnce(page(["c"], 3, 2));
    const { wrapper } = mountWithApp(CatalogView);
    await flushPromises();
    await wrapper.get('[data-testid="load-more"]').trigger("click");
    await flushPromises();
    expect(wrapper.findAll("a[href^='/produto/']").length).toBe(2);
    expect(wrapper.get('[role="alert"]').text()).toContain("Não foi possível carregar mais produtos");
    await wrapper.get('[data-testid="load-more"]').trigger("click");
    await flushPromises();
    expect(wrapper.findAll("a[href^='/produto/']").length).toBe(3);
  });
});
