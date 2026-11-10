import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductEditView from "@/features/admin/products/ProductEditView.vue";
import { adminProductsApi } from "@/api/admin-products.api";
import { adminCategoriesApi } from "@/api/admin-categories.api";
import { makeProduct, mountWithApp } from "@/test/mount";

vi.mock("@/api/admin-products.api", () => ({ adminProductsApi: { create: vi.fn(), get: vi.fn(), list: vi.fn(), update: vi.fn() } }));
vi.mock("@/api/admin-categories.api", () => ({ adminCategoriesApi: { list: vi.fn() } }));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(adminCategoriesApi.list).mockResolvedValue([]);
});

describe("ProductEditView", () => {
  it("shows the image manager right after a product is created", async () => {
    vi.mocked(adminProductsApi.create).mockResolvedValue(makeProduct({ id: "new1" }));
    const { wrapper } = mountWithApp(ProductEditView);
    await flushPromises();
    expect(wrapper.find('[data-testid="image-input"]').exists()).toBe(false);
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Camiseta nova");
    await inputs[1].setValue("100");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(adminProductsApi.create).toHaveBeenCalled();
    expect(wrapper.find('[data-testid="image-input"]').exists()).toBe(true);
  });
});
