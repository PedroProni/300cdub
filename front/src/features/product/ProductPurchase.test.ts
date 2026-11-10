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

  it("shows a muted disabled call to action with the hint and focuses the first available size without scrolling", async () => {
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product: makeProduct() }, attachTo: document.body });
    const cta = wrapper.get('[data-testid="want-this"]');
    expect(cta.attributes("disabled")).toBeDefined();
    expect(cta.classes()).toEqual(expect.arrayContaining(["disabled:bg-raised", "disabled:text-muted", "disabled:border-edge"]));
    expect(cta.classes()).not.toContain("disabled:opacity-50");
    expect(wrapper.text()).toContain("Escolha um tamanho");
    const first = wrapper.findAll("fieldset button")[0].element;
    expect(document.activeElement).toBe(first);
    wrapper.unmount();
  });

  it("does not focus any size when the product has none", async () => {
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product: makeProduct({ variants: [] }) }, attachTo: document.body });
    expect(document.activeElement).toBe(document.body);
    wrapper.unmount();
  });

  it("selects the only variant at once, shows a read-only label and keeps the size in the contact link", async () => {
    const product = makeProduct({ variants: [{ id: "u", label: "Único", stock: 4 }] });
    const { wrapper, router } = mountWithApp(ProductPurchase, { props: { product }, attachTo: document.body });
    expect(wrapper.find("fieldset").exists()).toBe(false);
    expect(wrapper.get('[data-testid="single-variant"]').text()).toBe("Tamanho: Único");
    expect(wrapper.get('[data-testid="want-this"]').attributes("disabled")).toBeUndefined();
    expect(wrapper.text()).not.toContain("Escolha um tamanho");
    expect(document.activeElement).toBe(document.body);
    await wrapper.get('[data-testid="want-this"]').trigger("click");
    await router.isReady();
    await new Promise((resolve) => setTimeout(resolve));
    expect(decodeURIComponent(router.currentRoute.value.fullPath)).toBe("/produto/camiseta-300c/contato?size=Único");
    wrapper.unmount();
  });

  it("keeps a single variant without stock disabled", () => {
    const product = makeProduct({ variants: [{ id: "u", label: "Único", stock: 0 }] });
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product } });
    expect(wrapper.get('[data-testid="want-this"]').attributes("disabled")).toBeDefined();
  });

  it("keeps several sizes disabled until one is chosen", async () => {
    const product = makeProduct({
      variants: [
        { id: "a", label: "P", stock: 2 },
        { id: "b", label: "M", stock: 2 },
      ],
    });
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product } });
    expect(wrapper.get('[data-testid="want-this"]').attributes("disabled")).toBeDefined();
    expect(wrapper.find('[data-testid="single-variant"]').exists()).toBe(false);
    await wrapper.findAll("fieldset button")[1].trigger("click");
    expect(wrapper.get('[data-testid="want-this"]').attributes("disabled")).toBeUndefined();
  });
});
