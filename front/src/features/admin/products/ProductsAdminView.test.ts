import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsAdminView from "@/features/admin/products/ProductsAdminView.vue";
import { adminProductsApi } from "@/api/admin-products.api";
import { makeProduct, mountWithApp } from "@/test/mount";

vi.mock("@/api/admin-products.api", () => ({ adminProductsApi: { list: vi.fn(), update: vi.fn(), remove: vi.fn(), reorder: vi.fn() } }));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(adminProductsApi.list).mockResolvedValue([makeProduct({ id: "a", slug: "a" }), makeProduct({ id: "b", slug: "b" })]);
});

describe("ProductsAdminView toggles", () => {
  it("renders both labelled switches in a wrapping controls group on every row", async () => {
    const { wrapper } = mountWithApp(ProductsAdminView);
    await flushPromises();
    const groups = wrapper.findAll('[data-testid="product-controls"]');
    expect(groups.length).toBe(2);
    for (const group of groups) {
      const switches = group.findAll('[role="switch"]');
      expect(switches.map((item) => item.text())).toEqual(["Visível na vitrine", "Destaque"]);
      expect(switches.every((item) => item.attributes("aria-label") === item.text())).toBe(true);
      expect(group.classes()).toEqual(expect.arrayContaining(["flex-wrap", "w-full", "xl:w-auto"]));
      expect(group.findAll("span.whitespace-nowrap").length).toBe(2);
    }
  });
});
