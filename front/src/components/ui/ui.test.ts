import { describe, expect, it } from "vitest";
import StockBadge from "@/components/ui/StockBadge.vue";
import PriceTag from "@/components/ui/PriceTag.vue";
import { mountWithApp } from "@/test/mount";

describe("StockBadge", () => {
  it.each([
    ["in_stock", "Em estoque", "In stock"],
    ["last_units", "Últimas unidades", "Last units"],
    ["sold_out", "Esgotado", "Sold out"],
  ] as const)("renders %s in both languages", (status, pt, en) => {
    expect(mountWithApp(StockBadge, { props: { status } }).wrapper.text()).toBe(pt);
    expect(mountWithApp(StockBadge, { props: { status }, locale: "en" }).wrapper.text()).toBe(en);
  });
});

describe("PriceTag", () => {
  it("shows the promo price, the old price and the discount", () => {
    const { wrapper } = mountWithApp(PriceTag, { props: { price: 100, promoPrice: 80 } });
    expect(wrapper.get('[data-testid="price-current"]').text()).toContain("80,00");
    expect(wrapper.get('[data-testid="price-old"]').text()).toContain("100,00");
    expect(wrapper.get('[data-testid="price-discount"]').text()).toBe("20% OFF");
  });

  it("shows only the price when there is no promotion", () => {
    const { wrapper } = mountWithApp(PriceTag, { props: { price: 100, promoPrice: null } });
    expect(wrapper.find('[data-testid="price-old"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="price-current"]').text()).toContain("100,00");
  });
});
