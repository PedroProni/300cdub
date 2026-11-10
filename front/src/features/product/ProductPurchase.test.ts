import { describe, expect, it } from "vitest";
import ProductPurchase from "@/features/product/ProductPurchase.vue";
import { makeProduct, mountWithApp } from "@/test/mount";

describe("ProductPurchase", () => {
  it("disables the call to action until a size with stock is chosen", async () => {
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product: makeProduct() } });
    const cta = wrapper.get('[data-testid="want-this"]');
    expect(cta.attributes("disabled")).toBeDefined();
    const buttons = wrapper.findAll("fieldset button");
    expect(buttons[1].attributes("disabled")).toBeDefined();
    await buttons[0].trigger("click");
    expect(wrapper.get('[data-testid="want-this"]').attributes("disabled")).toBeUndefined();
  });

  it("navigates to the contact page with the chosen size", async () => {
    const { wrapper, router } = mountWithApp(ProductPurchase, { props: { product: makeProduct() } });
    await wrapper.findAll("fieldset button")[0].trigger("click");
    await wrapper.get('[data-testid="want-this"]').trigger("click");
    await router.isReady();
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.currentRoute.value.fullPath).toBe("/produto/camiseta-300c/contato?size=M");
  });

  it("is enabled right away when the product has no variants", async () => {
    const { wrapper, router } = mountWithApp(ProductPurchase, { props: { product: makeProduct({ variants: [] }) } });
    expect(wrapper.find("fieldset").exists()).toBe(false);
    const cta = wrapper.get('[data-testid="want-this"]');
    expect(cta.attributes("disabled")).toBeUndefined();
    await cta.trigger("click");
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.currentRoute.value.fullPath).toBe("/produto/camiseta-300c/contato");
  });

  it("stays disabled and says sold out when there is no stock", () => {
    const { wrapper } = mountWithApp(ProductPurchase, {
      props: { product: makeProduct({ stockStatus: "sold_out", totalStock: 0, variants: [{ id: "v1", label: "M", stock: 0 }] }) },
    });
    const cta = wrapper.get('[data-testid="want-this"]');
    expect(cta.attributes("disabled")).toBeDefined();
    expect(cta.text()).toBe("Esgotado");
  });
});
