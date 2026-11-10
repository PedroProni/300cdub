import { describe, expect, it } from "vitest";
import { discountPercent, effectivePrice, formatPrice } from "@/utils/price";

describe("price", () => {
  it("formats BRL in pt and en", () => {
    expect(formatPrice(1234.5, "pt").replace(/\s/g, " ")).toBe("R$ 1.234,50");
    expect(formatPrice(1234.5, "en")).toBe("R$1,234.50");
  });

  it("computes the discount percentage", () => {
    expect(discountPercent(100, 75)).toBe(25);
    expect(discountPercent(100, null)).toBe(0);
    expect(discountPercent(100, 120)).toBe(0);
  });

  it("picks the effective price", () => {
    expect(effectivePrice(100, 80)).toBe(80);
    expect(effectivePrice(100, 100)).toBe(100);
    expect(effectivePrice(100, null)).toBe(100);
  });
});
