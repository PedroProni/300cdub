import { describe, expect, it } from "vitest";
import ProductCard from "@/features/catalog/ProductCard.vue";
import { makeProduct, mountWithApp } from "@/test/mount";

describe("ProductCard", () => {
  it("links to the product page with the cover and the stock badge", () => {
    const { wrapper } = mountWithApp(ProductCard, { props: { product: makeProduct({ stockStatus: "last_units" }) } });
    expect(wrapper.get("a").attributes("href")).toBe("/produto/camiseta-300c");
    expect(wrapper.get("img").attributes("src")).toBe("http://img/m.webp");
    expect(wrapper.get("img").attributes("alt")).toBe("Camiseta 300C");
    expect(wrapper.get('[data-testid="stock-badge"]').text()).toBe("Últimas unidades");
  });

  it("shows a translated placeholder when there is no image", () => {
    const { wrapper } = mountWithApp(ProductCard, { props: { product: makeProduct({ images: [] }) }, locale: "en" });
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.text()).toContain("No photo");
  });
});
